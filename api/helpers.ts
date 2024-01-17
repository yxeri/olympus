import {
  CookieOptions,
  createServerClient,
  serialize,
} from '@supabase/ssr';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { findPersonByAuth } from './people/get';

export const getAuthPerson = async ({
  req, res,
}: {
  req: NextApiRequest, res: NextApiResponse,
}) => {
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', serialize(name, value, options));
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', serialize(name, '', options));
        },
      },
    },
  );
  const user = await client.auth.getUser();

  if (!user.data.user?.id) {
    return undefined;
  }

  const authPerson = await findPersonByAuth(user.data.user.id);

  if (!authPerson) {
    throw new ApiError(401, 'Not authorised');
  }

  return authPerson;
};
