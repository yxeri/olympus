import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { collection } from 'lib/db/tools';

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  const dbCollection = await collection('people');

  try {
    res.status(200).json({
      people: await dbCollection.find().toArray(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
