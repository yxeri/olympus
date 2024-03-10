import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
import * as crypto from 'crypto';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import * as process from 'process';
import { findPerson } from '../../../api/people/get';
import { updatePerson } from '../../../api/people/patch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      email, name, family, password
    } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    const person = await findPerson({ name: name.toLowerCase(), family: family.toLowerCase() });

    if (!person) {
      throw new ApiError(404, 'Person doesn\'t exist');
    }

    if (person.mail || person.authId) {
      throw new ApiError(403, 'Person already exists');
    }

    if (password.length < 6) {
      throw new ApiError(400, 'Password needs to be at least 6 characters long');
    }

    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(process.env.SECRET ?? '', 'salt', 32);
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      key,
      iv,
    );
    const encryptedMail = `${Buffer.concat([
      cipher.update(Buffer.from(email, 'utf-8')),
      cipher.final(),
    ]).toString('hex')}$|$${iv.toString('hex')}$|$${cipher.getAuthTag().toString('hex')}`;
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    );

    const signupData = await supabaseClient.auth.signUp({
      password,
      email,
      options: {
        data: {
          [process.env.NEXT_PUBLIC_INSTANCE_NAME ?? '']: {
            identities: [{
              name: name.toLowerCase(),
              family: family.toLowerCase(),
            }],
          },
        },
      },
    });

    if ((signupData.data.user?.identities?.length ?? 0) === 0) {
      res.status(404).json({ error: 'No person found' });
    }

    const updateResult = await updatePerson({
      name: name.toLowerCase(),
      family: family.toLowerCase()
    }, { $set: { mail: encryptedMail, authId: signupData.data.user?.id } });

    if (updateResult.modifiedCount < 1) {
      throw new ApiError(500, 'Failed to update Person');
    }
    res.status(200).json({
      name: name.toLowerCase(),
      family: family.toLowerCase(),
    });
  } catch (error: any) {
    res.status(error?.statusCode ?? 500).json({
      error: error.message,
    });
  }
}
