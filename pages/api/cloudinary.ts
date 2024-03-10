import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { updatePerson } from '../../api/people/patch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      api_key: apiKey, public_id: publicId, folder, version
    } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    if (apiKey !== process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
      || (process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' && !folder?.includes('/dev/'))) {
      throw new ApiError(500, 'api error');
    }

    const [name, family] = publicId?.split('/')?.pop()?.split('-') ?? [];

    if (!name || !family) {
      throw new ApiError(500, 'invalid filename');
    }

    if (!version) {
      throw new ApiError(500, 'invalid version');
    }

    await updatePerson({ name, family }, { $set: { imgVersion: version } });

    res.status(200).json({});
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
