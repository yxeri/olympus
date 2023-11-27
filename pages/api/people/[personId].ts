import { ObjectId } from 'mongodb';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { findPerson } from '../../../api/people/get';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
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

      break;
    }
    case 'GET': {
      const { personId } = req.query;
      const person = await findPerson({ _id: new ObjectId(personId as string) });

      res.status(200).json({ person });

      break;
    }
    default: {
      res.status(500).json({
        error: 'No endpoint',
      });

      break;
    }
  }
}
