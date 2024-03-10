import { collection } from '@/lib/db/tools';
import { Alias } from '@/types/data';
import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { getAuthPerson } from '../helpers';

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const dbCollection = await collection<Alias>('aliases');
    const { alias } = typeof req.body === 'object'
      ? req.body
      : JSON.parse(req.body);

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

    const aliasToCreate: Alias = {
      ...alias,
      owner: new ObjectId(authPerson._id.toString()),
      createdAt: new Date(),
      groupAccess: alias.groupAccess ?? [],
      postAccess: alias.postAccess ?? [],
      readAccess: alias.readAccess ?? [],
    };

    const result = await dbCollection
      .insertOne(aliasToCreate);

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
