import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { calendarEventsAtom } from 'atoms/calendar';

const StyledDiv = styled.div`
  background-color: white;
`;

const Calendar = () => {
  const icalSource = useRecoilValue(calendarEventsAtom);

  return (
    <StyledDiv>
      <FullCalendar
        locale="se"
        events={[...icalSource.values()]}
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
      />
    </StyledDiv>
  );
};

export default Calendar;
