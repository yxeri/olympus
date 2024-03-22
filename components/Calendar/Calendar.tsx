import { selectedCalendarsAtom } from '@/atoms/calendar';

import { colors } from '@/styles/global';
import { FullEvent } from '@/types/data';
import React, { useState } from 'react';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import 'react-big-calendar/lib/sass/styles.scss';
import { useRecoilValue } from 'recoil';
import { RRule } from 'rrule';
import styled from 'styled-components';
import useCalendars from '../../hooks/calendars/useCalendars';
import Toolbar from './Toolbar';

const {
  Calendar: BigCalendar,
  dayjsLocalizer,
} = await import('react-big-calendar');
const dayjs = await import('dayjs').then((mod) => mod.default);
const svLocale = await import('dayjs/locale/sv').then((mod) => mod.default);
const dayjsUtc = await import('dayjs/plugin/utc').then((mod) => mod.default);
const dayjsWeekday = await import('dayjs/plugin/weekday').then((mod) => mod.default);

const StyledDiv = styled.div`
    .rbc-time-view, .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
        background-color: ${colors.componentBackground};
        border-color: ${colors.primaryColor};
        border-radius: 4px;
    }

    .rbc-calendar {
        height: calc(100svh - 4.1rem);
        box-sizing: border-box;
        width: 100%;
    }

    .rbc-today {
        background-color: ${colors.selected};
    }

    .rbc-time-gutter, .rbc-time-header-cell, .rbc-agenda-date-cell {
        background-color: ${colors.clickableBackground};
    }

    .rbc-time-header-gutter {
        width: 46.4453px;
    }

    .rbc-calendar, .rbc-header, .rbc-events-container, .rbc-time-header-content, .rbc-time-header, .rbc-time-content, .rbc-timeslot-group, .rbc-day-bg {
        border-color: ${colors.primaryColor};
    }

    .rbc-day-slot .rbc-events-container {
        margin-right: 0;
    }

    .rbc-time-slot {
        border-color: ${colors.active};
    }

    .rbc-event {
        background-color: ${colors.brightColor};
        color: ${colors.primaryColor};
        border: 1px solid;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
    }

    .rbc-agenda-empty {
        margin-left: 1rem;
        margin-top: 1rem;
    }

    .rbc-agenda-table {
        position: sticky;
        top: 0;
        background-color: ${colors.componentBackground};
        z-index: 2;
    }

    .rbc-agenda-content {
        z-index: 1;
    }

    .rbc-agenda-view .rbc-header {
        padding: 5px 10px !important;
    }
`;

dayjs.extend(dayjsWeekday);
dayjs.extend(dayjsUtc);

dayjs.locale(
  'sv',
  svLocale,
);

const localizer = dayjsLocalizer(dayjs);

const Calendar = () => {
  const { calendars } = useCalendars();
  const selectedCalendars = useRecoilValue(selectedCalendarsAtom);
  const [span, setSpan] = useState({
    start: new Date(dayjs()
      .utc()
      .weekday(0)
      .format()),
    end: new Date(dayjs()
      .utc()
      .weekday(6)
      .format()),
  });
  const events: FullEvent[] = (
    selectedCalendars.length === 0 || selectedCalendars[0] === 'all'
      ? calendars.map((calendar) => calendar.events.map((event: FullEvent) => ({
        ...event,
        calendar: calendar.name,
      })))
        .flat()
      : calendars
        .filter((calendar) => selectedCalendars.includes(calendar.name))
        .map((calendar) => calendar.events.map((event: FullEvent) => ({
          ...event,
          calendar: calendar.name,
        }) ?? []))
        .flat()
  )?.map((fullEvent) => {
    if (!fullEvent) {
      return [];
    }

    const {
      rrule,
      ...event
    } = fullEvent;

    if (event.start) {
      // eslint-disable-next-line no-param-reassign
      event.start = new Date(event.start);
    }

    if (event.end) {
      // eslint-disable-next-line no-param-reassign
      event.end = new Date(event.end);
    }

    if (rrule) {
      const rule = new RRule({ dtstart: event.start, ...rrule });

      return [
        event,
        ...rule.between(
          span.start,
          span.end,
        )
          .map((date) => {
            const recurDate = new Date(date);
            const start = new Date(recurDate);
            const end = new Date(recurDate);

            if (event.start) {
              start.setUTCHours(
                event.start.getUTCHours(),
                event.start.getUTCMinutes(),
              );
            }

            if (event.end) {
              end.setUTCHours(
                event.end.getUTCHours(),
                event.end.getUTCMinutes(),
              );
            }

            return {
              ...event,
              start,
              end,
            };
          }),
      ];
    }

    return [event];
  })
    .flat();

  return (
    <StyledDiv>
      <BigCalendar
        min={new Date(
          1972,
          0,
          1,
          7,
        )}
        step={15}
        eventPropGetter={
          (event: FullEvent) => ({
            style: {
              backgroundColor: calendars
                .find((calendar) => calendar.name === event.calendar)
                ?.color,
            },
          })
        }
        components={{
          toolbar: Toolbar,
        }}
        culture="sv"
        defaultView="week"
        onRangeChange={(range) => {
          if (Array.isArray(range)) {
            if (range.length === 1) {
              const tomorrow = new Date(range[0]);
              tomorrow.setDate(tomorrow.getDate() + 1);

              setSpan({
                start: range[0],
                end: tomorrow,
              });

              return;
            }

            setSpan({
              start: range[0],
              end: range[range.length - 1],
            });

            return;
          }

          const {
            start,
            end,
          } = range as { start: Date, end: Date };

          setSpan({
            start,
            end,
          });
        }}
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        // resources={[...([...icalSource.values()].reduce((resources, event) => {
        //   if (event.location) {
        //     resources.set(event.location, {
        //       resourceId: event.location,
        //       resourceName: event.location,
        //     });
        //   }
        //
        //   return resources;
        // }, new Map()).values())]}
        // resourceIdAccessor="resourceId"
        // resourceTitleAccessor="resourceName"
      />
    </StyledDiv>
  );
};

export default Calendar;
