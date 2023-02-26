import { Person } from '@data';
import {
  collection,
  createPersonSet
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
import { validatePerson } from 'utils/validatePerson';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbCollection = await collection('people');
    const { people } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (!Array.isArray(people)) {
      throw Error('Expected People[]');
    }

    const filteredPeople = people.filter((person) => validatePerson(person)[0]);
    const filteredIds: string[] = filteredPeople.map((person) => person._id);

    const updatedIds: Array<{ _id?: ObjectId, name?: string, family?: string }> = [];
    const {
      insertedIds,
      existIndexes,
    } = await dbCollection
      .insertMany(filteredPeople.map((person) => ({
        _id: person._id
          ? new ObjectId(person._id)
          : undefined,
        ...person,
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

        return {
          existIndexes: indexes,
          insertedIds: Object
            .values(operation.result.insertedIds)
            .filter((id) => !existIds.includes(id)),
        };
      });

    if (existIndexes.length > 0) {
      const operations: AnyBulkWriteOperation[] = [];

      filteredPeople
        .reduce<[string | undefined, Person][]>((existingPeople, person, index) => {
        if (existIndexes.includes(index)) {
          existingPeople.push([filteredIds[index], person]);
        }

        return existingPeople;
      }, [])
        .forEach(([id, person]) => {
          const filter = id
            ? { _id: new ObjectId(id) }
            : { name: person.name, family: person.family };
          updatedIds.push(filter);

          try {
            operations.push({
              updateOne: {
                filter,
                update: createPersonSet(person).set,
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
    res.status(500).json({
      error: error.message,
    });
  }
}
