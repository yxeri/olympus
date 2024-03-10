import { collection } from '@/lib/db/tools';
import { Document } from '@/types/data';
import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { getAuthPerson } from '../helpers';
import {
  findDocument,
  hasAccessToDocument,
} from './get';

export default async function patch(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const dbCollection = await collection<Document>('documents');
    const { document } = typeof req.body === 'object'
      ? req.body
      : JSON.parse(req.body);
    const documentUpdate = {
      ...(document.postAccess && { postAccess: document.postAccess }),
      ...(document.readAccess && { readAccess: document.readAccess }),
      ...(document.groupAccess && { groupAccess: document.groupAccess }),
      ...(document.title && { title: document.title }),
      ...(document.json && { json: document.json }),
      lastModified: new Date(),
    };

    console.log(documentUpdate);

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

    const existingDocument = await findDocument({ _id: new ObjectId(document._id.toString()) });

    if (!existingDocument) {
      throw new ApiError(
        404,
        'Not found',
      );
    }

    if (!authPerson?.auth?.documents?.admin
      && !hasAccessToDocument({
        authPerson,
        document: existingDocument as Document,
        hasPostAccess: true,
      })) {
      throw new ApiError(
        403,
        'Not allowed',
      );
    }

    const result = await dbCollection
      .updateOne(
        { _id: existingDocument?._id },
        { $set: { ...documentUpdate } },
      );

    res.status(200)
      .json({
        modifiedCount: result.modifiedCount,
      });
  } catch (error: any) {
    console.log(error);
    res.status(error?.statusCode ?? 500)
      .json({
        error: error.message,
      });
  }
}
