import {
  Id,
  ResponseError
} from '@api/people/types';
import {
  Person,
  PersonObject
} from '@data';
import {
  collection,
  createSet
} from 'lib/db/tools';
import {
  AnyBulkWriteOperation,
  MongoBulkWriteError,
  ObjectId
} from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';

import { validatePerson } from 'utils/validatePerson';

type ResponseSuccess = {
  updatedIndexes: Id[],
  insertedIds: string[],
};

type ResponseData = ResponseError | ResponseSuccess;

export default async function post(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const dbCollection = await collection<Person>('people');
    const { people } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (!Array.isArray(people)) {
      throw new ApiError(400, 'Expected People[]');
    }

    const filteredIds: string[] = [];
    const filteredPeople: Person[] = people.reduce((filtered, person) => {
      if (validatePerson(person)[0]) {
        filtered.push({
          ...person,
          name: person.name.toLowerCase(),
          family: person.family.toLowerCase(),
        });

        if (person._id) {
          filteredIds.push(person._id);
        }
      }

      return filtered;
    }, []);

    console.log(filteredPeople);

    const updatedIds: Id[] = [];
    const {
      insertedIds,
      existIndexes,
    } = await dbCollection
      .insertMany(filteredPeople.map((person) => ({
        _id: person._id
          ? new ObjectId(person._id)
          : undefined,
        ...person,
        profile: person.profile ?? {},
      })), { ordered: false })
      .then((result) => ({
        insertedIds: Object.values(result.insertedIds),
        existIndexes: ([] as number[]),
      }))
      .catch((operation: MongoBulkWriteError) => {
        const indexes: number[] = [];
        const existIds = Array.isArray(operation.writeErrors)
          ? operation.writeErrors.reduce<string[]>((failed, error) => {
            failed.push(error.err.op._id);
            indexes.push(error.index);

            return failed;
          }, [])
          : [];
        const inserted = (Object
          .values(operation.result.insertedIds)
          .filter((id) => !existIds.includes(id)) as string[]);

        return {
          existIndexes: indexes,
          insertedIds: inserted,
        };
      });

    if (existIndexes.length > 0) {
      const operations: AnyBulkWriteOperation<Person>[] = [];

      filteredPeople
        .reduce<[string | undefined, Person][]>((existingPeople, person, index) => {
        if (existIndexes.includes(index)) {
          existingPeople.push([filteredIds[index], person]);
        }

        return existingPeople;
      }, [])
        .forEach(([id, person]) => {
          const filter: Id = id
            ? { _id: new ObjectId(id) }
            : { name: person.name, family: person.family };
          updatedIds.push(filter);

          try {
            operations.push({
              updateOne: {
                filter,
                update: createSet<typeof PersonObject>(person, PersonObject).set,
              },
            });
          } catch (error) {
            console.log('error', error);
          }
        });

      if (operations.length > 0) {
        await dbCollection.bulkWrite(operations);
      }
    }

    res.status(200).json({
      updatedIndexes: updatedIds,
      insertedIds: insertedIds.map((id) => id.toString()),
    });
  } catch (error: any) {
    console.log(error);
    res.status(error?.status ?? 500).json({
      error: error.message,
    });
  }
}