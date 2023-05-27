import { calendarEventsAtom } from 'atoms/calendar';
import dayjs from 'dayjs';
import svLocale from 'dayjs/locale/sv';
import dayjsUtc from 'dayjs/plugin/utc';
import dayjsWeekday from 'dayjs/plugin/weekday';
import { useState } from 'react';
import {
  Calendar as BigCalendar,
  dayjsLocalizer
} from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import 'react-big-calendar/lib/sass/styles.scss';
import { useRecoilValue } from 'recoil';
import { RRule } from 'rrule';
import styled from 'styled-components';

const StyledDiv = styled.div`
  background-color: white;
`;

dayjs.extend(dayjsWeekday);
dayjs.extend(dayjsUtc);

dayjs.locale('sv', svLocale);

const localizer = dayjsLocalizer(dayjs);

const Calendar = () => {
  const icalSource = useRecoilValue(calendarEventsAtom);
  const [span, setSpan] = useState({
    start: new Date(dayjs().utc().weekday(0).format()),
    end: new Date(dayjs().utc().weekday(6).format()),
  });
  const events = [...icalSource.values()].map((fullEvent) => {
    const { rrule, ...event } = fullEvent;

    if (rrule) {
      const rule = new RRule({ dtstart: event.start, ...rrule });

      return [event, ...rule.between(span.start, span.end).map((date) => {
        const recurDate = new Date(date);
        const start = new Date(recurDate);
        const end = new Date(recurDate);

        start.setUTCHours(event.start.getUTCHours(), event.start.getUTCMinutes());
        end.setUTCHours(event.end.getUTCHours(), event.end.getUTCMinutes());

        return {
          ...event,
          start,
          end,
        };
      })];
    }

    return [event];
  }).flat();

  return (
    <StyledDiv>
      <BigCalendar
        culture="sv"
        defaultView="week"
        onRangeChange={(range) => {
          if (Array.isArray(range)) {
            setSpan({ start: range[0], end: range[range.length - 1] });

            return;
          }

          const { start, end } = range as { start: Date, end: Date };

          setSpan({ start, end });
        }}
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        resources={[...([...icalSource.values()].reduce((resources, event) => {
          if (event.location) {
            resources.set(event.location, {
              resourceId: event.location,
              resourceName: event.location,
            });
          }

          return resources;
        }, new Map()).values())]}
        resourceAccessor="location"
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceName"
        style={{ height: 'calc(100vh - 4.1rem)', maxWidth: '100vw' }}
      />
    </StyledDiv>
  );
};

export default Calendar;
