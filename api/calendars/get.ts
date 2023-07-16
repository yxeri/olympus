import {
  NextApiRequest,
  NextApiResponse
} from 'next';
import { collection } from '../../lib/db/tools';
import {
  Calendar,
  FullEvent
} from '../../types/data';

export const getCalendars: () => Promise<Calendar[]> = async () => {
  const calendarCollection = await collection<FullEvent>('calendars');

  return calendarCollection.find<Calendar>({}).toArray();
};

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({
      calendars: await getCalendars(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
