import { Person } from '@/types/data';
import * as console from 'console';
import { collection } from 'lib/db/tools';
import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { Id } from './types';

export const getPeople: () => Promise<Person[]> = async () => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection
    .find<Person>({})
    .project<Person>({
      email: 0,
      authId: 0,
      auth: 0,
    })
    .toArray();
};

export const findPerson: (id: Id) => Promise<Person | null> = async (id) => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection.findOne(
    id,
    {
      projection: {
        email: 0,
        authId: 0,
        auth: 0,
      },
    },
  );
};

export const findPersonByAuth: (authId: string) => Promise<Person | null> = async (authId) => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection.findOne(
    { authId },
    { projection: { email: 0 } },
  );
};

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const query = req.query || {};

    if (query.personId || (query.name && query.family)) {
      res.status(200)
        .json({
          person: await findPerson(
            query.personId
              ? { _id: new ObjectId(query.personId.toString()) }
              : {
                name: query.name as string,
                family: query.family as string,
              },
          ),
        });

      return;
    }

    res.status(200)
      .json({
        people: await getPeople(),
      });
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode ?? 500)
      .json({
        error: error.message,
      });
  }
}
