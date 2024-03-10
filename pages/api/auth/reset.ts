import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import * as process from 'process';
import { findPerson } from '../../../api/people/get';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      name,
      family,
    } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    const person = await findPerson({ name: name.toLowerCase(), family: family.toLowerCase() });

    if (!person) {
      throw new ApiError(404, 'Person doesn\'t exist');
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

    const data = await supabaseClient.auth.resetPasswordForEmail(decryptedMail);

    if (!data || data?.error) {
      console.log(data);
      throw new ApiError(401, 'Auth failed');
    }

    res.status(200).json({});
  } catch (error: any) {
    console.log(error);

    res.status(error?.status ?? 500).json({
      error: error.message,
    });
  }
}
