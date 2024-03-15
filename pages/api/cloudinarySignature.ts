import { v2 as cloudinary } from 'cloudinary';
import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { paramsToSign } = req.body;
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET ?? '',
    );

    console.log(signature);
    res.status(200)
      .json({
        signature,
      });
  } catch (error: any) {
    res.status(500)
      .json({
        error: error.message,
      });
  }
}
