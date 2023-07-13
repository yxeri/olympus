import { findPersonByAuth } from '@api/people/get';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';

export const getAuthPerson = async ({
  req, res,
}: {
  req: NextApiRequest, res: NextApiResponse,
}) => {
  const client = createPagesServerClient({ req, res });
  const user = await client.auth.getUser();

  if (!user.data.user?.id) {
    throw new ApiError(500, 'Something went wrong');
  }

  const authPerson = await findPersonByAuth(user.data.user.id);

  if (!authPerson) {
    throw new ApiError(401, 'Not authorised');
  }

  return authPerson;
};
