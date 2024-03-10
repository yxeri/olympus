import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  get,
  patch,
  post,
} from '../../api/documents';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      await post(req, res);

      break;
    }
    case 'GET': {
      await get(req, res);

      break;
    }
    case 'PATCH': {
      await patch(req, res);

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
