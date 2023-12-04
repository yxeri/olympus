import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';
import {
  Thread
} from '../../types/data';
import { findForum } from '../forums/get';
import { getAuthPerson } from '../helpers';
import { findThread } from './get';

export default async function patch(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbCollection = await collection<Thread>('threads');
    const { thread, like } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (!thread._id) {
      throw new ApiError(400, 'Missing id');
    }

    const authPerson = await getAuthPerson({ req, res });

    if (!authPerson) {
      throw new ApiError(403, 'Not allowed');
    }

    const existingThread = await findThread({
      authPerson,
      _id: new ObjectId(thread._id.toString()),
    });

    if (typeof like === 'boolean') {
      const alreadyLiked = existingThread
        ?.likes
        ?.find((likeId) => likeId.toString() === authPerson._id?.toString());
      const alreadyDisliked = existingThread
        ?.dislikes
        ?.find((likeId) => likeId.toString() === authPerson._id?.toString());

      const update = like ? {
        $pull: {
          dislikes: new ObjectId(authPerson._id?.toString()),
          ...(alreadyLiked && { likes: new ObjectId(authPerson._id?.toString()) }),
        },
        ...(!alreadyLiked && { $addToSet: { likes: new ObjectId(authPerson._id?.toString()) } }),
      } : {
        $pull: {
          likes: new ObjectId(authPerson._id?.toString()),
          ...(alreadyDisliked && { dislikes: new ObjectId(authPerson._id?.toString()) }),
        },
        ...(!alreadyDisliked
          && { $addToSet: { dislikes: new ObjectId(authPerson._id?.toString()) } }),
      };

      const result = await dbCollection
        .updateOne({ _id: new ObjectId(thread._id.toString()) }, update);

      res.status(200).json({
        modifiedCount: result.modifiedCount,
      });

      return;
    }

    const threadUpdate: any = {
      ...(thread.title && { title: thread.title }),
      ...(thread.content && { content: thread.content }),
      ...(thread.images && { images: thread.images }),
      ...(thread.locked && { locked: thread.locked }),
      ...(thread.pinned && { pinned: thread.pinned }),
      lastModified: new Date(),
    };

    if (existingThread?.forumId.toString() !== thread.forumId.toString()) {
      threadUpdate.forumId = new ObjectId(threadUpdate.forumId.toString());

      const oldForum = await findForum({ _id: new ObjectId(existingThread?.forumId.toString()) });

      if (!oldForum) {
        throw new ApiError(404, 'Not found');
      }

      if (!authPerson.auth?.forums.admin && ![oldForum?.owner.toString()].includes(authPerson._id?.toString() ?? '')) {
        throw new ApiError(403, 'Not allowed');
      }
    }

    const result = await dbCollection
      .updateOne({ _id: new ObjectId(thread._id.toString()) }, { $set: threadUpdate });

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
