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
import { findForum } from '../forums/get';
import { getAuthPerson } from '../helpers';

export default async function remove(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { thread } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
    const threadCollection = await collection<Forum>('threads');

    const authPerson = await getAuthPerson({ req, res });
    const existingForum = await findForum({ _id: new ObjectId(thread._id?.toString()) });

    if (!existingForum) {
      throw new ApiError(404, 'Not found');
    }

    if (!authPerson?.auth?.forums.admin
      && authPerson?._id?.toString() !== existingForum?.owner?.toString()) {
      throw new ApiError(403, 'Not allowed');
    }

    const result = await threadCollection
      .deleteOne({ _id: new ObjectId(thread._id.toString()) });

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
