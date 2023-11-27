import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { collection } from '../../lib/db/tools';
import {
  Forum,
  Person,
} from '../../types/data';

export const hasAccessToForum = ({
  forum,
  authPerson,
  hasPostAccess,
}: { forum: Forum, authPerson?: Person, hasPostAccess?: boolean }) => (
  (!hasPostAccess || forum?.postAccess?.length === 0)
    && forum.groupAccess?.length === 0
    && forum.readAccess?.length === 0)
  || [
    forum?.owner.toString(),
    ...((hasPostAccess ? forum?.postAccess : forum?.readAccess) ?? [])
  ].includes(authPerson?._id?.toString() ?? '')
  || (
    authPerson
    && forum?.groupAccess?.some(([fieldName, value]) => authPerson[fieldName] === value)
  );

export const findForum: (id: { _id: ObjectId }) => Promise<Forum | null> = async (id) => {
  const forumCollection = await collection<Forum>('forums');

  return forumCollection.findOne(id);
};

export const getForums: ({ projection, type }: {
  projection?: { [key in keyof Forum]: 0 | 1 },
  type?: Forum['type'],
}) => Promise<Forum[]> = async ({ projection, type }) => {
  const forumCollection = await collection<Forum>('forums');
  const filter: any = {};

  if (type) {
    filter.type = type;
  }

  return forumCollection
    .find<Forum>(filter, { projection })
    .toArray();
};

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body || {};
    const { forum }: {
      forum: { _id: ObjectId | string },
    } = typeof body === 'object' ? body : JSON.parse(body);
    const query = req.query || {};

    if (forum) {
      res.status(200).json({
        forum: await findForum({ _id: new ObjectId(forum._id?.toString()) }),
      });

      return;
    }

    res.status(200).json({
      forums: await getForums({ type: query.type as Forum['type'] }),
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
