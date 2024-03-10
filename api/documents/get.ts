import { collection } from '@/lib/db/tools';
import {
  Document,
  Person,
} from '@/types/data';
import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';

export const hasAccessToDocument = ({
  document,
  authPerson,
  hasPostAccess,
}: { document: Document, authPerson?: Person, hasPostAccess?: boolean }) => (
    (!hasPostAccess || document?.postAccess?.length === 0)
    && document.groupAccess?.length === 0
    && document.readAccess?.length === 0)
  || [
    document.owner.toString(),
    ...((hasPostAccess
      ? document.postAccess
      : document.readAccess) ?? []),
  ].includes(authPerson?._id?.toString() ?? '')
  || (
    authPerson
    && document?.groupAccess?.some(([fieldName, value]) => authPerson[fieldName] === value)
  );

export const findDocument: ({
  _id,
  authPerson,
}: {
  _id: ObjectId,
  authPerson?: Person,
}) => Promise<Document | null> = async ({
  _id,
  authPerson,
}) => {
  const documentCollection = await collection<Document>('documents');
  const orFilter: Array<{ [key in keyof Partial<Document>]: {} }> = [
    {
      groupAccess: { $size: 0 },
      readAccess: { $size: 0 },
    },
    {
      groupAccess: { $not: { $size: 0 } },
    },
  ];

  if (authPerson) {
    orFilter.push({ owner: new ObjectId(authPerson._id?.toString()) });
  }

  const document = await documentCollection.findOne({
    _id,
    $or: orFilter,
  });

  if (document && !hasAccessToDocument({
    document,
    authPerson,
  })) {
    throw new ApiError(
      403,
      'Not allowed',
    );
  }

  return document;
};

export const getDocuments: ({
  page,
}: {
  page?: number,
}) => Promise<Document[]> = async ({ page = 0 }) => {
  const documentCollection = await collection<Document>('documents');

  return documentCollection
    .find<Document>(
      {},
      { projection: { json: 0 } },
    )
    .sort({ createdAt: -1 })
    .skip(page * 20)
    .limit(20)
    .toArray();
};

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const query = req.query || {};
    const page = !!query.page && typeof query.page === 'number'
      ? Number(query.page)
      : 0;

    if (query.documentId) {
      res.status(200)
        .json({
          document: await findDocument({ _id: new ObjectId(query.documentId.toString()) }),
        });

      return;
    }

    res.status(200)
      .json({
        documents: await getDocuments({ page }),
      });
  } catch (error: any) {
    res.status(500)
      .json({
        error: error.message,
      });
  }
}
