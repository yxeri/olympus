import { getAuthPerson } from '@api/helpers';
import { Calendar } from '@data';
import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { collection } from '../../lib/db/tools';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbCollection = await collection<Calendar>('calendars');
    const { calendar } = typeof req.body === 'object' ? req.body : JSON.parse(req.body);

    const authPerson = await getAuthPerson({ req, res });

    if (!authPerson?.auth?.calendars?.admin) {
      throw new ApiError(403, 'Not allowed');
    }

    const result = await dbCollection
      .updateOne({ name: calendar.name }, { $set: { ...calendar } }, { upsert: true });

    res.status(200).json({
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
  } catch (error: any) {
    console.log(error);
    res.status(error?.status ?? 500).json({
      error: error.message,
    });
  }
}
