import { FullEvent } from '@data';
import useCalendars from '@hooks/calendars/useCalendars';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import ArrowRightIcon from 'assets/arrow-right.svg';
import CalendarIcon from 'assets/calendar.svg';
import dayjs from 'dayjs';
import svLocale from 'dayjs/locale/sv';
import dayjsUtc from 'dayjs/plugin/utc';
import dayjsWeekday from 'dayjs/plugin/weekday';
import React, { useState } from 'react';
import {
  Calendar as BigCalendar,
  dayjsLocalizer,
  ToolbarProps
} from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import 'react-big-calendar/lib/sass/styles.scss';
import { useRecoilValue } from 'recoil';
import { RRule } from 'rrule';
import styled from 'styled-components';
import { selectedCalendarsAtom } from '../../atoms/calendar';

import { colors } from '../../styles/global';
import Button from '../Button/Button';

const StyledDiv = styled.div`
  .rbc-time-view, .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
    background-color: ${colors.componentBackground};
    border-color: ${colors.primaryColor};
    border-radius: 4px;
  }
  
  .rbc-calendar {
    height: calc(100svh - 4.1rem);
    box-sizing: border-box;
    padding: .5rem;
    width: 100%;
  }
  
  .rbc-today {
    background-color: ${colors.selected};
  }
  
  .rbc-time-gutter, .rbc-time-header-cell {
    background-color: ${colors.clickableBackground};
  }
  
  .rbc-time-header-gutter {
    width: 46.4453px;
  }
  
  .rbc-calendar, .rbc-header, .rbc-events-container, .rbc-time-header-content, .rbc-time-header, .rbc-time-content, .rbc-timeslot-group, .rbc-day-bg {
    border-color: ${colors.primaryColor};
  }
  
  .rbc-time-slot {
    border-color: ${colors.active};
  }
  
  .rbc-event {
    background-color: ${colors.brightColor};
    color: ${colors.primaryColor};
    border: 1px solid;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.5);
  }
`;

const ToolbarButton = styled(Button)`
  background-color: inherit;
  color: ${colors.brightColor};
  border-bottom: none;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 2rem;
  position: relative;
  padding: 0 1rem;
`;

const NavContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: .5rem;
`;

const DateSpan = styled.span`
  text-align: center;
  position: absolute;
  right: 0;
  left: 0;
  top: -1.7rem;
  color: ${colors.brightColor};
  background-color: ${colors.primaryTransBackground};
  font-size: 1.1rem;
  z-index: 2;
  width: fit-content;
  margin: 0 auto;
  padding: .1rem;
`;

dayjs.extend(dayjsWeekday);
dayjs.extend(dayjsUtc);

dayjs.locale('sv', svLocale);

const localizer = dayjsLocalizer(dayjs);

const Toolbar: React.FC<ToolbarProps> = ({
  label, onNavigate, onView
}) => (
  <ToolbarContainer>
    <NavContainer>
      <ToolbarButton onClick={() => onNavigate('PREV')} aria-label="Previous"><ArrowLeftIcon /></ToolbarButton>
      <ToolbarButton onClick={() => onNavigate('TODAY')} aria-label="Today"><CalendarIcon /></ToolbarButton>
      <ToolbarButton onClick={() => onNavigate('NEXT')} aria-label="Next"><ArrowRightIcon /></ToolbarButton>
    </NavContainer>
    <DateSpan>{label}</DateSpan>
    <NavContainer>
      <ToolbarButton onClick={() => onView('week')} aria-label="Week"><CalendarIcon /></ToolbarButton>
      <ToolbarButton onClick={() => onView('day')} aria-label="Day"><CalendarIcon /></ToolbarButton>
      <ToolbarButton onClick={() => onView('agenda')} aria-label="Agenda"><CalendarIcon /></ToolbarButton>
    </NavContainer>
  </ToolbarContainer>
);

const Calendar = () => {
  const { calendars } = useCalendars();
  const selectedCalendars = useRecoilValue(selectedCalendarsAtom);
  const [span, setSpan] = useState({
    start: new Date(dayjs().utc().weekday(0).format()),
    end: new Date(dayjs().utc().weekday(6).format()),
  });
  const events = (
    selectedCalendars.length === 0
      ? calendars.map((calendar) => calendar.events.map((event: FullEvent) => ({
        ...event,
        calendar: calendar.name,
      }))).flat()
      : calendars
        .filter((calendar) => selectedCalendars.includes(calendar.name))
        .map((calendar) => calendar.events.map((event: FullEvent) => ({
          ...event,
          calendar: calendar.name,
        }) ?? [])).flat()
  )?.map((fullEvent) => {
    if (!fullEvent) {
      return [];
    }

    const { rrule, ...event } = fullEvent;
    // eslint-disable-next-line no-param-reassign
    event.start = new Date(event.start);
    // eslint-disable-next-line no-param-reassign
    event.end = new Date(event.end);

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
        selectable
        components={{
          toolbar: Toolbar,
        }}
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
