import {
  NextApiRequest,
  NextApiResponse,
} from 'next';

export type Env = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  instanceName?: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
};

export default async function get(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  const env: Env = {
    supabaseUrl: process.env.SUPABASE_URL as string,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY as string,
    instanceName: process.env.NEXT_PUBLIC_INSTANCE_NAME as string,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
  };

  res.status(200)
    .json(env);
}
