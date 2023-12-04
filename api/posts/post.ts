import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';
import {
  Post
} from '../../types/data';
import {
  findForum,
  hasAccessToForum
} from '../forums/get';
import { getAuthPerson } from '../helpers';
import { findThread } from '../threads/get';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbCollection = await collection<Post>('posts');
    const { post: postData } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
    const authPerson = await getAuthPerson({ req, res });

    if (!authPerson) {
      throw new ApiError(403, 'Not allowed');
    }

    const thread = await findThread({
      authPerson,
      _id: new ObjectId(postData.threadId.toString())
    });

    if (!thread) {
      throw new ApiError(403, 'Not allowed');
    }

    const forum = await findForum({ _id: new ObjectId(thread?.forumId?.toString()) });

    if (!forum || !hasAccessToForum({
      authPerson,
      forum,
      hasPostAccess: true,
    })) {
      throw new ApiError(403, 'Not allowed');
    }

    // Sub-post
    if (postData.postId) {
      const result = await dbCollection
        .updateOne(
          { _id: new ObjectId(postData.postId.toString()) },
          { $push: { subPosts: { ...postData, _id: new ObjectId() } } },
        );

      res.status(200).json({
        modifiedCount: result.modifiedCount,
      });

      return;
    }

    const result = await dbCollection
      .insertOne({
        ...postData,
        threadId: new ObjectId(postData.threadId.toString()),
        media: postData.media ?? [],
        subPosts: [],
        owner: authPerson._id,
        createdAt: new Date()
      });

    res.status(200).json({
      insertedId: result.insertedId,
    });
  } catch (error: any) {
    console.log(error);
    res.status(error?.statusCode ?? 500).json({
      error: error.message,
    });
  }
}
