//

import { findPerson } from '@api/people/get';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import * as process from 'process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      name,
      family,
      password,
      otp,
    } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (!password && !otp) {
      throw new ApiError(400, 'Required: password | otp');
    }

    const person = await findPerson({ name: name.toLowerCase(), family: family.toLowerCase() });

    if (!person) {
      throw new ApiError(404, 'Person doesn\'t exist');
    }

    if (person.mail) {
      throw new ApiError(403, 'Person already exists');
    }

    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        },
      },
    );

    const [encrypted, iv, tag] = person?.mail?.split('$|$') ?? [];
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      crypto.scryptSync(process.env.SECRET ?? '', 'salt', 32),
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    const decryptedMail = decipher.update(encrypted, 'hex', 'utf-8') + decipher.final('utf-8');

    let data;

    if (password) {
      data = await supabaseClient.auth.signInWithPassword({
        password,
        email: decryptedMail,
      });
    } else if (otp) {
      data = await supabaseClient.auth.signInWithOtp({
        email: decryptedMail,
        options: { shouldCreateUser: false }
      });
    }

    if (data?.error) {
      throw new ApiError(401, 'Auth failed');
    }

    res.status(200).json({
      session: data?.data.session,
    });
  } catch (error: any) {
    console.log(error);

    res.status(error?.status ?? 500).json({
      error: error.message,
    });
  }
}
