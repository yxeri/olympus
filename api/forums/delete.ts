import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';
import {
  Forum
} from '../../types/data';
import { getAuthPerson } from '../helpers';
import { findForum } from './get';

export default async function remove(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { forum } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
    const forumCollection = await collection<Forum>('forums');

    const authPerson = await getAuthPerson({ req, res });
    const existingForum = await findForum({ _id: new ObjectId(forum._id?.toString()) });

    if (!existingForum) {
      throw new ApiError(404, 'Not found');
    }

    if (!authPerson.auth?.forums.admin
      && authPerson._id?.toString() !== existingForum?._id?.toString()) {
      throw new ApiError(403, 'Not allowed');
    }

    const result = await forumCollection
      .deleteOne({ _id: new ObjectId(forum._id.toString()) });

    res.status(200).json({
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.log(error);
    res.status(error?.status ?? 500).json({
      error: error.message,
    });
  }
}
