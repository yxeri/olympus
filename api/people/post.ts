import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { validatePerson } from 'utils/validatePerson';
import {
  collection,
  createPersonSet
} from 'lib/db/tools';
import {
  AnyBulkWriteOperation,
  MongoBulkWriteError
} from 'mongodb';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbCollection = await collection('people');
    const { people } = JSON.parse(req.body);

    if (!Array.isArray(people)) {
      throw Error('Expected People[]');
    }

    const failed: number[] = [];
    const filteredPeople = people.filter((person, index) => {
      const [isValid] = validatePerson(person);

      if (!isValid) {
        failed.push(index);
      }

      return isValid;
    });

    const {
      insertedIds,
      failedIds,
    } = await dbCollection
      .insertMany(filteredPeople, { ordered: false })
      .then((result) => ({
        insertedIds: Object.values(result.insertedIds),
        failedIds: [] as string[],
      }))
      .catch((operation: MongoBulkWriteError) => {
        const failedWriteIds: string[] = Array.isArray(operation.writeErrors)
          ? operation.writeErrors.map((error) => error.err.op._id.valueOf())
          : [];

        return {
          failedIds: failedWriteIds,
          insertedIds: Object.values(operation.result.insertedIds),
        };
      });

    if (failedIds?.length > 0) {
      const operations: AnyBulkWriteOperation[] = [];

      filteredPeople
        .filter((person) => failedIds.includes(person._id))
        .forEach((person) => {
          try {
            operations.push({
              updateOne: {
                filter: { name: person.name, family: person.family },
                update: createPersonSet(person).set,
              },
            });
          } catch (error) {
            console.log('error', error);
          }
        });

      await dbCollection.bulkWrite(operations);
    }

    res.status(200).json({
      failed: failed.length > 0 && failed,
      ids: insertedIds,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}
