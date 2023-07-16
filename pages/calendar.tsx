import CalendarComponent from 'components/Calendar/Calendar';
import { GetStaticProps } from 'next';
import { SWRConfig } from 'swr';
import { getCalendars } from '../api/calendars/get';
import { url } from '../hooks/calendars/useCalendars';
import { Calendar } from '../types/data';

type StaticProps = {
  fallback: {
    [url]: { calendars?: Calendar[] },
  },
};

export default function CalendarPage({ fallback }: StaticProps) {
  return (
    <div className="calendar-container">
      <SWRConfig value={{ fallback }}>
        <CalendarComponent />
      </SWRConfig>
    </div>
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const calendars = await getCalendars();

  return {
    props: {
      fallback: {
        [url]: {
          calendars: calendars
            .map((calendar) => ({ ...calendar, _id: calendar?._id?.toString() }))
        },
      },
    },
  };
};
