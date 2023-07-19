import { toast } from 'react-toastify';
import useSwr, { SWRResponse } from 'swr';
import { Calendar } from '../../types/data';

type InsertCalendar = (calendar: Calendar) => void;
type UseCalendarsReturn = Omit<SWRResponse, 'data'> & {
  calendars: Calendar[],
  insert: InsertCalendar,
};

export const url = '/api/calendars';

export default function useCalendars(): UseCalendarsReturn {
  const {
    data,
    ...swr
  } = useSwr(
    url,
    (urlKey) => fetch(urlKey).then((res) => res.json()),
    {
      keepPreviousData: true,
    }
  );
  const insertCalendar: InsertCalendar = (calendar) => fetch(url, {
    method: 'POST',
    body: JSON.stringify({ calendar }),
  }).then(() => {
    toast.success('Upload complete!');

    return swr.mutate();
  }).catch(() => toast.error('Something went wrong'));

  return {
    ...swr,
    calendars: data?.calendars ?? [],
    insert: insertCalendar,
  };
}
