import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getAuthPerson } from '../../../api/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      try {
        const authPerson = await getAuthPerson({ req, res });

        res.status(200).json({
          person: authPerson,
        });
      } catch (error: any) {
        console.log(error);
        res.status(error?.status ?? 500).json({
          error: error.message,
        });
      }

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
