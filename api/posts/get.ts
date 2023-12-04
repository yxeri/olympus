import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';
import {
  Person,
  Post,
} from '../../types/data';
import {
  findForum,
  hasAccessToForum
} from '../forums/get';
import { getAuthPerson } from '../helpers';
import { findThread } from '../threads/get';

export const findPost: ({
  _id,
  authPerson,
}: {
  _id: ObjectId,
  authPerson?: Person,
}) => Promise<Post | null> = async ({ _id, authPerson }) => {
  const postCollection = await collection<Post>('posts');
  const post = await postCollection.findOne({ _id });

  if (!post) {
    throw new ApiError(404, 'Not found');
  }

  const thread = await findThread({ _id: new ObjectId(post.threadId.toString()), authPerson });

  if (!thread) {
    throw new ApiError(404, 'Not found');
  }

  const forum = await findForum({ _id: new ObjectId(thread.forumId.toString()) });

  if (!forum) {
    throw new ApiError(404, 'Not found');
  }

  if (!hasAccessToForum({ forum, authPerson })) {
    throw new ApiError(403, 'Not allowed');
  }

  return post;
};

export const getPosts: ({
  threadId,
  authPerson,
  page,
}: {
  page?: number
  threadId?: ObjectId,
  authPerson?: Person,
}) => Promise<Post[]> = async ({
  authPerson,
  threadId,
  page = 0
}) => {
  const postCollection = await collection<Post>('posts');

  if (threadId) {
    await findThread({ _id: threadId, authPerson });

    return postCollection
      .find<Post>({ threadId })
      .skip(page * 20)
      .limit(20)
      .toArray();
  }

  return [];
};

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = req.query || {};
    const page = !!query.page && typeof query.page === 'number'
      ? Number(query.page)
      : 0;

    const authPerson = await getAuthPerson({ req, res });

    if (query.postId) {
      res.status(200).json({
        post: await findPost({ _id: new ObjectId(query.postId.toString()), authPerson })
      });

      return;
    }

    if (query.threadId) {
      res.status(200).json({
        posts: await getPosts({
          authPerson,
          page,
          threadId: new ObjectId(query.threadId.toString()),
        }),
      });

      return;
    }

    throw new ApiError(400, 'Missing data');
  } catch (error: any) {
    console.log(error);
    res.status(error?.statusCode ?? 500).json({
      error: error.message,
    });
  }
}
