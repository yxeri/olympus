import {
  Person,
  PersonObject
} from '@data';
import {
  collection,
  createPersonSet
} from 'lib/db/tools';
import {
  AnyBulkWriteOperation,
  ObjectId
} from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';

export default async function patch(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbCollection = await collection('people');
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
          people: Partial<Person & Required<{ _id | name & family }>>[], 
          update: Partial<Person>,
         }`
      );
    }

    const operations: AnyBulkWriteOperation[] = [];
    let modified = 0;
    let matched = 0;

    people.forEach((person) => {
      const filter = person._id
        ? { _id: new ObjectId(person._id) }
        : { name: person.name, family: person.family };

      operations.push({
        updateOne: {
          filter,
          update: createPersonSet(updateAll ?? person).set,
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
