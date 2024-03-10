import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';
import {
  Alias,
  Person,
} from '../../types/data';
// eslint-disable-next-line import/no-cycle
import { hasAccessToAlias } from './patch';

export const getAliases: () => Promise<Alias[]> = async () => {
  const aliasCollection = await collection<Alias>('aliases');

  return aliasCollection.find<Alias>({}).toArray();
};

export const findAlias: ({
  _id,
  authPerson,
} : {
  _id: ObjectId,
  authPerson?: Person,
}) => Promise<Alias | null> = async ({ _id, authPerson }) => {
  const aliasCollection = await collection<Alias>('aliases');
  const orFilter: Array<{ [key in keyof Partial<Alias>]: {} }> = [{
    groupAccess: { $size: 0 },
    readAccess: { $size: 0 },
  }, {
    groupAccess: { $not: { $size: 0 } },
  }];

  if (authPerson) {
    orFilter.push({ owner: new ObjectId(authPerson._id?.toString()) });
  }

  const alias = await aliasCollection.findOne({ _id, $or: orFilter });

  if (alias && !hasAccessToAlias({ alias, authPerson })) {
    throw new ApiError(403, 'Not allowed');
  }

  return alias;
};

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({
      aliases: await getAliases(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
