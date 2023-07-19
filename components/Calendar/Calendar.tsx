import { Checkbox } from '@radix-ui/react-checkbox';
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
import {
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { RRule } from 'rrule';
import styled from 'styled-components';
import FilterIcon from '../../assets/filter.svg';
import ListIcon from '../../assets/list.svg';
import ArrowLeftIcon from '../../assets/arrow-left.svg';
import ArrowRightIcon from '../../assets/arrow-right.svg';
import CalendarIcon from '../../assets/calendar.svg';
import { selectedCalendarsAtom } from '../../atoms/calendar';
import useCalendars from '../../hooks/calendars/useCalendars';

import { colors } from '../../styles/global';
import { FullEvent } from '../../types/data';
import Button from '../Button/Button';
import Container from '../Container/Container';
import List from '../List/List';
import ListItem from '../List/ListItem';
import Modal, { Trigger } from '../Modal/Modal';

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
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }
  
  .rbc-agenda-empty {
    margin-left: 1rem;
    margin-top: 1rem;
  }
`;

const ToolbarButton = styled(Button)`
  background-color: inherit;
  color: ${colors.brightColor};
  border-bottom: none;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  min-width: 2.1rem;
  text-align: center;
  cursor: pointer;

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
  grid-gap: 1rem;
  font-size: .9rem;
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

const StyledCheckbox = styled(Checkbox)`
  height: 1rem;
  width: 1rem;
  padding: .1rem;
  margin-right: .5rem;
  position: relative;
  border: 1px solid;
  background-color: ${colors.componentBackground};
  border-radius: 15%;
  &[data-state="checked"] {
    background-color: ${colors.primaryColor};
  }
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
`;

dayjs.extend(dayjsWeekday);
dayjs.extend(dayjsUtc);

dayjs.locale('sv', svLocale);

const localizer = dayjsLocalizer(dayjs);

const Toolbar: React.FC<ToolbarProps> = ({
  label,
  onNavigate,
  onView

}) => {
  const { calendars } = useCalendars();
  const [selected, setSelected] = useRecoilState(selectedCalendarsAtom);

  return (
    <ToolbarContainer>
      <NavContainer>
        <Modal
          trigger={(
            <Trigger asChild>
              <ToolbarButton>
                <FilterIcon />
              </ToolbarButton>
            </Trigger>
)}
          content={(
            <Container>
              <List style={{ gap: '.5rem' }}>
                <ListItem>
                  <StyledLabel htmlFor="all">
                    <StyledCheckbox id="all" name="all" checked={selected.includes('all')} onCheckedChange={() => setSelected(['all'])} />
                    All
                  </StyledLabel>
                </ListItem>
                {calendars.map((calendar) => (
                  <ListItem>
                    <StyledLabel htmlFor={calendar.name}>
                      <StyledCheckbox
                        id={calendar.name}
                        name={calendar.name}
                        checked={selected.includes(calendar.name)}
                        onCheckedChange={(checkedState) => {
                          if (!checkedState) {
                            const filteredSelected = [...selected.filter(
                              (name) => name !== calendar.name
                            )];

                            if (filteredSelected.length < 1) {
                              setSelected(['all']);
                            } else {
                              setSelected(filteredSelected);
                            }
                          } else if (selected[0] === 'all') {
                            setSelected([calendar.name]);
                          } else {
                            setSelected([...selected, calendar.name]);
                          }
                        }}
                      />
                      {calendar.name}
                    </StyledLabel>
                  </ListItem>
                ))}
              </List>
            </Container>
)}
          title="Calendars"
        />
        <ToolbarButton onClick={() => onNavigate('PREV')} aria-label="Previous"><ArrowLeftIcon /></ToolbarButton>
        <ToolbarButton onClick={() => onNavigate('TODAY')} aria-label="Today"><CalendarIcon /></ToolbarButton>
        <ToolbarButton onClick={() => onNavigate('NEXT')} aria-label="Next"><ArrowRightIcon /></ToolbarButton>
      </NavContainer>
      <DateSpan>{label}</DateSpan>
      <NavContainer>
        <ToolbarButton onClick={() => onView('week')} aria-label="Week">
          7
        </ToolbarButton>
        <ToolbarButton onClick={() => onView('day')} aria-label="Day">1</ToolbarButton>
        <ToolbarButton onClick={() => onView('agenda')} aria-label="Agenda"><ListIcon /></ToolbarButton>
      </NavContainer>
    </ToolbarContainer>
  );
};

const Calendar = () => {
  const { calendars } = useCalendars();
  const selectedCalendars = useRecoilValue(selectedCalendarsAtom);
  const [span, setSpan] = useState({
    start: new Date(dayjs().utc().weekday(0).format()),
    end: new Date(dayjs().utc().weekday(6).format()),
  });
  const events = (
    selectedCalendars.length === 0 || selectedCalendars[0] === 'all'
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
        eventPropGetter={
        (event: FullEvent) => ({
          style: {
            backgroundColor: calendars.find((calendar) => calendar.name === event.calendar)?.color,
          }
        })
}
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
