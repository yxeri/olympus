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

export default async function patch(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbCollection = await collection<Forum>('forums');
    const { forum } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
    const forumUpdate = {
      postAccess: forum.postAccess,
      readAccess: forum.readAccess,
      groupAccess: forum.groupAccess,
      name: forum.name,
      pinned: forum.pinned,
      lastModified: new Date(),
    };

    const authPerson = await getAuthPerson({ req, res });

    if (!authPerson) {
      throw new ApiError(403, 'Not allowed');
    }

    const existingForum = await findForum({ _id: new ObjectId(forum._id.toString()) });

    if (!existingForum) {
      throw new ApiError(404, 'Not found');
    }

    if (!authPerson.auth?.forums?.admin && ![existingForum?.owner.toString()].includes(authPerson._id?.toString() ?? '')) {
      throw new ApiError(403, 'Not allowed');
    }

    const result = await dbCollection
      .updateOne({ _id: existingForum._id }, { $set: { ...forumUpdate } });

    res.status(200).json({
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.log(error);
    res.status(error?.statusCode ?? 500).json({
      error: error.message,
    });
  }
}
