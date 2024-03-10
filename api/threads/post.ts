import { collection } from '@/lib/db/tools';
import { Thread } from '@/types/data';
import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import {
  findForum,
  hasAccessToForum,
} from '../forums/get';
import { createForum } from '../forums/post';
import { getAuthPerson } from '../helpers';

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const dbCollection = await collection<Thread>('threads');
    const { thread } = typeof req.body === 'object'
      ? req.body
      : JSON.parse(req.body);
    let forum = await findForum({ _id: new ObjectId(thread.forumId.toString()) });

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

    if (!forum) {
      if (authPerson._id?.toString() !== thread.forumId.toString()) {
        throw new ApiError(
          404,
          'Not found',
        );
      }

      // Create a new personal forum for the user

      await createForum({
        authPerson,
        forum: {
          name: `${authPerson.name} ${authPerson.family}`,
          _id: new ObjectId(thread.forumId.toString()),
          type: 'personal',
        },
      });

      forum = await findForum({
        _id: new ObjectId(thread.forumId.toString()),
      });
    }

    if (!forum || !hasAccessToForum({
      authPerson,
      forum,
      hasPostAccess: true,
    })) {
      throw new ApiError(
        403,
        'Not allowed',
      );
    }

    const result = await dbCollection
      .insertOne({
        ...thread,
        likes: [],
        dislikes: [],
        media: thread.media ?? [],
        forumId: new ObjectId(thread.forumId.toString()),
        locked: false,
        pinned: [],
        posts: [],
        owner: authPerson._id,
        createdAt: new Date(),
      });

    res.status(200)
      .json({
        insertedId: result.insertedId,
      });
  } catch (error: any) {
    console.log(error);
    res.status(error?.statusCode ?? 500)
      .json({
        error: error.message,
      });
  }
}
