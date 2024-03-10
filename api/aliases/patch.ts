import { collection } from '@/lib/db/tools';
import {
  Alias,
  Person,
} from '@/types/data';
import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { getAuthPerson } from '../helpers';
// eslint-disable-next-line import/no-cycle
import { findAlias } from './get';

export const hasAccessToAlias = ({
  alias,
  authPerson,
  hasPostAccess = true,
}: { alias: Alias, authPerson?: Person, hasPostAccess?: boolean }) => (
    (!hasPostAccess || alias?.postAccess?.length === 0)
    && alias.groupAccess?.length === 0
    && alias.readAccess?.length === 0)
  || [
    alias.owner.toString(),
    ...((hasPostAccess
      ? alias.postAccess
      : alias.readAccess) ?? []),
  ].includes(authPerson?._id?.toString() ?? '')
  || (
    authPerson
    && alias?.groupAccess?.some(([fieldName, value]) => authPerson[fieldName] === value)
  );

export default async function patch(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const dbCollection = await collection<Alias>('aliases');
    const { alias } = typeof req.body === 'object'
      ? req.body
      : JSON.parse(req.body);
    const aliasUpdate = {
      ...(alias.postAccess && { postAccess: alias.postAccess }),
      ...(alias.readAccess && { readAccess: alias.readAccess }),
      ...(alias.groupAccess && { groupAccess: alias.groupAccess }),
      ...(alias.name && { name: alias.name }),
      ...(alias.family && { name: alias.family }),
      lastModified: new Date(),
    };

    const authPerson = await getAuthPerson({
      req,
      res,
    });

    if (!authPerson) {
      throw new ApiError(
        403,
        'Not allowed',
      );
    }

    const existingAlias = await findAlias({ _id: new ObjectId(alias._id.toString()) });

    if (!existingAlias) {
      throw new ApiError(
        404,
        'Not found',
      );
    }

    if (!authPerson?.auth?.documents?.admin
      && !hasAccessToAlias({
        authPerson,
        alias: existingAlias as Alias,
        hasPostAccess: true,
      })) {
      throw new ApiError(
        403,
        'Not allowed',
      );
    }

    const result = await dbCollection
      .updateOne(
        { _id: existingAlias?._id },
        { $set: { ...aliasUpdate } },
      );

    res.status(200)
      .json({
        modifiedCount: result.modifiedCount,
      });
  } catch (error: any) {
    console.log(error);
    res.status(error?.statusCode ?? 500)
      .json({
        error: error.message,
      });
  }
}
