import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { findPerson } from '../../../api/people/get';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { personId } = req.query;
    const person = await findPerson({ _id: new ObjectId(personId as string) });

    res.status(200).json({ person });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
}
