import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';
import {
  Forum,
  Person
} from '../../types/data';
import { getAuthPerson } from '../helpers';

export const createForum = async ({
  authPerson,
  forum,
}: {
  forum: Partial<Forum>,
  authPerson: Person,
}) => {
  const dbCollection = await collection<Forum>('forums');

  const result = await dbCollection
    .insertOne({
      ...forum,
      owner: new ObjectId(authPerson._id?.toString()),
      createdAt: new Date(),
      type: forum.type ?? 'forum',
      pinned: [],
      groupAccess: [],
      postAccess: [],
      readAccess: [],
    } as Forum);

  return {
    insertedId: result.insertedId,
  };
};

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { forum }: { forum: Partial<Forum> } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (!forum.name) {
      throw new ApiError(400, 'Missing data');
    }

    const authPerson = await getAuthPerson({ req, res });

    if (!authPerson) {
      throw new ApiError(403, 'Not allowed');
    }

    res.status(200).json(createForum({
      authPerson,
      forum,
    }));
  } catch (error: any) {
    res.status(error?.status ?? 500).json({
      error: error.message,
    });
  }
}
