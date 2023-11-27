import * as console from 'console';
import { collection } from 'lib/db/tools';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import {
  Person,
} from '../../types/data';
import { Id } from './types';

export const getPeople: () => Promise<Person[]> = async () => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection
    .find<Person>({})
    .project<Person>({ email: 0, authId: 0, auth: 0 }).toArray();
};

export const findPerson: (id: Id) => Promise<Person | null> = async (id) => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection.findOne(id, { projection: { email: 0, authId: 0, auth: 0 } });
};

export const findPersonByAuth: (authId: string) => Promise<Person | null> = async (authId) => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection.findOne({ authId }, { projection: { email: 0 } });
};

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body || {};

    const { person }: {
      person: Id,
    } = typeof body === 'object' ? body : JSON.parse(body);

    if (person) {
      res.status(200).json({
        person: await findPerson(person),
      });

      return;
    }

    res.status(200).json({
      people: await getPeople(),
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}
