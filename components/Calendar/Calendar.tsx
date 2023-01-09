import { Calendar as BigCalendar, dateFnsLocalizer, CalendarProps } from 'react-big-calendar';
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { sv } from 'date-fns/locale';
import styled from 'styled-components';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'sv_SE': sv },
});

const StyledCalendar = styled(BigCalendar)`
  height: 500px;
  width: 500px;
  color: black;
  background-color: white;
`;

const Calendar = () => {
  return (
    <div>
      {/* Big calendar doesn't play well with Styled components */}
      {/* @ts-ignore */}
      <StyledCalendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};

export default Calendar;
