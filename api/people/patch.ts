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
  Person,
  PersonObject
} from '../../types/data';
import { getAuthPerson } from '../helpers';
import {
  Id,
  IdName
} from './types';

type ResponseSuccess = {
  modified: number,
  matched: number,
};

type ResponseError = {
  error: string,
};

type Response = ResponseSuccess | ResponseError;

export const updatePerson: (
  id: IdName,
  update: UpdateFilter<Person>,
) => Promise<UpdateResult> = async (
  id,
  update,
) => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection.updateOne(id, update);
};

export default async function patch(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const dbCollection = await collection<Person>('people');
    const {
      people,
      updateAll
    }: {
      people: Partial<Person>[],
      updateAll?: Partial<typeof PersonObject>,
    } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (
      !Array.isArray(people)
      || !people.every((person) => (person._id || (person.name && person.family)))
    ) {
      throw Error(
        `Expected { 
          people: _id | name & family, 
          update: Partial<Person>,
         }`
      );
    }

    const authPerson = await getAuthPerson({ req, res });

    if (
      (people.length > 1 && !authPerson?.auth?.people?.admin)
      || ((people[0].name !== authPerson.name || people[0].family !== authPerson.family)
        && people[0]._id?.toString() !== authPerson._id?.toString())) {
      throw new ApiError(403, 'Not allowed');
    }

    const operations: AnyBulkWriteOperation<Person>[] = [];
    let modified = 0;
    let matched = 0;

    people.forEach((person) => {
      if (person.name) {
        // eslint-disable-next-line no-param-reassign
        person.name = person.name.toLowerCase();
      }

      if (person.family) {
        // eslint-disable-next-line no-param-reassign
        person.family = person.family.toLowerCase();
      }

      const filter: Id = person._id
        ? { _id: new ObjectId(person._id) }
        : { name: person.name as string, family: person.family as string };

      operations.push({
        updateOne: {
          filter,
          update: createSet<typeof PersonObject>(updateAll ?? person, PersonObject).set,
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
    res.status(500).json({
      error: error.message,
    });
  }
}
