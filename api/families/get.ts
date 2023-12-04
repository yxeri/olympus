import * as console from 'console';
import { collection } from 'lib/db/tools';
import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import {
  Family,
} from '../../types/data';
import { FamilyId } from './types';

export const getFamilies: () => Promise<Family[]> = async () => {
  const familiesCollection = await collection<Family>('families');

  return familiesCollection
    .find<Family>({})
    .toArray();
};

export const findFamily: (
  id: FamilyId,
) => Promise<Family | null> = async (id) => {
  const familiesCollection = await collection<Family>('families');

  return familiesCollection.findOne(id);
};

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = req.query || {};

    if (query.familyId || query.name) {
      res.status(200).json({
        person: await findFamily(
          query.familyId
            ? { _id: new ObjectId(query.familyId.toString()) }
            : { name: query.name as string },
        ),
      });

      return;
    }

    res.status(200).json({
      people: await getFamilies(),
    });
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode ?? 500).json({
      error: error.message,
    });
  }
}
