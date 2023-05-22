import { findPerson } from '@api/people/get';
import { updatePerson } from '@api/people/patch';
import { Buffer } from 'buffer';
import * as crypto from 'crypto';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import * as process from 'process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, name, family } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    const person = await findPerson({ name: name.toLowerCase(), family: family.toLowerCase() });

    if (!person) {
      throw new ApiError(404, 'Person doesn\'t exist');
    }

    if (person.mail) {
      throw new ApiError(403, 'Person already exists');
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

    const updateResult = await updatePerson({
      name: name.toLowerCase(),
      family: family.toLowerCase()
    }, { $set: { mail: encryptedMail } });

    if (updateResult.modifiedCount < 1) {
      throw new ApiError(500, 'Failed to update Person');
    }
    res.status(200).json({
      name: name.toLowerCase(),
      family: family.toLowerCase(),
    });
  } catch (error: any) {
    res.status(error?.status ?? 500).json({
      error: error.message,
    });
  }
}
