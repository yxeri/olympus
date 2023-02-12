import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbClient = await clientPromise;
    const db = dbClient.db(process.env.DBNAME);
    const { people } = req.body;

    await db.collection('people').insertMany(people);

    res.status(200).json({});
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
