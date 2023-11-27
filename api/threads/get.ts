import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';
import {
  Forum,
  Person,
  Thread,
} from '../../types/data';
import {
  findForum,
  hasAccessToForum
} from '../forums/get';
import { createForum } from '../forums/post';
import { getAuthPerson } from '../helpers';

export const findThread: ({
  _id,
  authPerson,
}: {
  _id: ObjectId,
  authPerson: Person,
}) => Promise<Thread | null> = async ({ _id, authPerson }) => {
  const threadCollection = await collection<Thread>('threads');
  const thread = await threadCollection.findOne({ _id });

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

  return thread;
};

export const getThreads: ({
  forumId,
  authPerson,
  page,
}: {
  page?: number
  forumId?: ObjectId,
  authPerson: Person,
}) => Promise<Thread[]> = async ({ forumId, authPerson, page = 0 }) => {
  const threadCollection = await collection<Thread>('threads');
  const forumIds = [];

  if (forumId) {
    forumIds.push(forumId);

    let forum = await findForum({ _id: forumId });

    if (!forum) {
      if (authPerson._id?.toString() !== forumId.toString()) {
        throw new ApiError(404, 'Not found');
      }

      // Create a new personal forum for the user

      await createForum({
        authPerson,
        forum: {
          name: `${authPerson.name} ${authPerson.family}`,
          _id: forumId,
          type: 'personal',
        },
      });

      forum = await findForum({
        _id: new ObjectId(authPerson._id.toString()),
      });
    }

    if (!forum || !hasAccessToForum({ forum, authPerson })) {
      throw new ApiError(403, 'Not allowed');
    }
  } else {
    const forumCollection = await collection<Forum>('forums');
    const forums = (await forumCollection.find({
      $or: [{
        groupAccess: { $size: 0 },
        readAccess: { $size: 0 },
      }, {
        groupAccess: { $not: { $size: 0 } },
      }, {
        owner: new ObjectId(authPerson._id?.toString())
      }, {
        readAccess: new ObjectId(authPerson._id?.toString()),
      }],
    }, {
      projection: {
        _id: 1,
        owner: 1,
        readAccess: 1,
        groupAccess: 1,
      },
    })
      .toArray())
      .filter((forum) => hasAccessToForum({ forum, authPerson }));

    forumIds.push(...forums.map((forum) => forum._id));
  }

  return threadCollection
    .find<Thread>({ forumId: { $in: forumIds } })
    .sort({ createdAt: -1 })
    .skip(page * 20)
    .limit(20)
    .toArray();
};

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = req.query || {};
    const page = !!query.page && typeof query.page === 'number'
      ? Number(query.page)
      : 0;

    const authPerson = await getAuthPerson({ req, res });

    if (query.threadId) {
      res.status(200).json({
        thread: await findThread({
          authPerson,
          _id: new ObjectId(query.threadId.toString()),
        }),
      });

      return;
    }

    if (query.forumId) {
      res.status(200).json({
        threads: await getThreads({
          authPerson,
          page,
          forumId: new ObjectId(query.forumId.toString()),
        }),
      });

      return;
    }

    res.status(200).json({
      threads: await getThreads({
        authPerson,
        page,
      }),
    });
  } catch (error: any) {
    console.log(error);
    res.status(error?.status ?? 500).json({
      error: error.message,
    });
  }
}
