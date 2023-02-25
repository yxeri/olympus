import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ObjectId } from 'mongodb';
import {
  collection,
  createPersonSet
} from 'lib/db/tools';
import { PersonObject } from 'data';

export default async function patch(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbCollection = await collection('people');
    const {
      ids,
      update
    }: {
      ids: string[],
      update: Partial<typeof PersonObject>,
    } = JSON.parse(req.body);

    if (!Array.isArray(ids) || !update || Object.keys(update).length <= 0) {
      throw Error('Expected ids: [id] and update: partial Person');
    }

    const {
      failed,
      set: dbUpdate,
    } = createPersonSet(update);

    const { modifiedCount } = await dbCollection.updateMany(
      { _id: { $in: ids.map((id) => new ObjectId(id)) } },
      dbUpdate,
    );

    res.status(200).json({
      failed,
      count: modifiedCount,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
