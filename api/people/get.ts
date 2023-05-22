import { Id } from '@api/people/types';
import { Person } from '@data';
import { collection } from 'lib/db/tools';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';

export const getPeople: () => Promise<Person[]> = async () => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection.find<Person>({}).project<Person>({ email: 0 }).toArray();
};

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({
      people: await getPeople(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export const findPerson: (id: Id) => Promise<Person | null> = async (id) => {
  const peopleCollection = await collection<Person>('people');

  return peopleCollection.findOne(id, { projection: { email: 0 } });
};
