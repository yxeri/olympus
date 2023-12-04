import {
  collection,
  createSet
} from 'lib/db/tools';
import {
  AnyBulkWriteOperation,
  ObjectId,
  UpdateFilter,
  UpdateResult
} from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import {
  Family,
  FamilyObject,
} from '../../types/data';
import { getAuthPerson } from '../helpers';
import {
  FamilyId,
} from './types';

type ResponseSuccess = {
  modified: number,
  matched: number,
};

type ResponseError = {
  error: string,
};

type Response = ResponseSuccess | ResponseError;

export const updateFamily: (
  id: FamilyId,
  update: UpdateFilter<Family>,
) => Promise<UpdateResult> = async (
  id,
  update,
) => {
  const familyCollection = await collection<Family>('families');

  return familyCollection.updateOne(id, update);
};

export default async function patch(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const dbCollection = await collection<Family>('families');
    const {
      families,
      updateAll
    }: {
      families: Partial<Family>[],
      updateAll?: Partial<Family>,
    } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (
      !Array.isArray(families)
      || !families.every((family) => (family._id || family.name))
    ) {
      throw Error(
        `Expected { 
          families: _id | name, 
          update: Partial<Family>,
         }`
      );
    }

    const authPerson = await getAuthPerson({ req, res });

    if (
      (families.length > 1 && !authPerson?.auth?.people?.admin)
      || (families[0].name !== authPerson?.family)) {
      throw new ApiError(403, 'Not allowed');
    }

    const operations: AnyBulkWriteOperation<Family>[] = [];
    let modified = 0;
    let matched = 0;

    families.forEach((family) => {
      if (family.name) {
        // eslint-disable-next-line no-param-reassign
        family.name = family.name.toLowerCase();
      }

      const filter: FamilyId = family._id
        ? { _id: new ObjectId(family._id.toString()) }
        : { name: family.name as string };

      operations.push({
        updateOne: {
          filter,
          upsert: true,
          update: createSet<typeof FamilyObject>(updateAll ?? family, FamilyObject).set,
        },
      });
    });

    if (operations.length > 0) {
      const {
        matchedCount,
        modifiedCount,
      } = await dbCollection.bulkWrite(operations, { ordered: false });

      modified = modifiedCount;
      matched = matchedCount;
    }

    res.status(200).json({
      modified,
      matched,
    });
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode ?? 500).json({
      error: error.message,
    });
  }
}
