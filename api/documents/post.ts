import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';
import {
  Person,
  Document,
} from '../../types/data';
import { getAuthPerson } from '../helpers';

export const createDocument = async ({
  authPerson,
  document,
}: {
  document: Partial<Document>,
  authPerson: Person,
}) => {
  const dbCollection = await collection<Document>('documents');

  const result = await dbCollection
    .insertOne({
      ...document,
      tags: document.tags ?? [],
      owner: new ObjectId(authPerson._id.toString()),
      createdAt: new Date(),
      groupAccess: [],
      postAccess: [new ObjectId(authPerson._id.toString())],
      readAccess: [],
    } as Document);

  return {
    insertedId: result.insertedId,
  };
};

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { document }: { document: Partial<Document> } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (!document.title) {
      throw new ApiError(400, 'Missing data');
    }

    const authPerson = await getAuthPerson({ req, res });

    if (!authPerson) {
      throw new ApiError(403, 'Not allowed');
    }

    res.status(200).json(await createDocument({
      authPerson,
      document,
    }));
  } catch (error: any) {
    console.log(error);
    res.status(error?.statusCode ?? 500).json({
      error: error.message,
    });
  }
}
