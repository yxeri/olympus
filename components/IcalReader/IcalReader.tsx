import dayjs from 'dayjs';
import dayjsUtc from 'dayjs/plugin/utc';
// @ts-ignore
import iCal from 'ical.js';
import { useRef } from 'react';
import {
  Frequency,
  Weekday,
  WeekdayStr
} from 'rrule';
import randomColor from 'randomcolor';
import useCalendars from '../../hooks/calendars/useCalendars';
import useAuthPerson from '../../hooks/people/useAuthPerson';
import { FullEvent } from '../../types/data';
import Container from '../Container/Container';

dayjs.extend(dayjsUtc);

type JsonEvent = [
  label: string,
  event: [
    label: 'created' | 'location' | 'summary' | 'last-modified' | 'status' | 'description' | 'uid' | 'dtend' | 'dtstart' | 'rrule',
    object: any,
    type: 'date-time' | 'integer' | 'text' | 'recur',
    value: any,
  ][],
  alarms: any[],
];

const IcalReader = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { insert } = useCalendars();
  const { person: authPerson } = useAuthPerson();

  if (!authPerson?.auth?.calendars?.admin) {
    return null;
  }

  return (
    <Container style={{
      overflow: 'hidden',
    }}
    >
      <h3>Upload calendar</h3>
      <input
        ref={inputRef}
        type="file"
        accept="text/calendar"
        onChange={(changeEvent) => {
          if (changeEvent.target.files?.[0]) {
            const reader = new FileReader();

            reader.addEventListener('load', (loadEvent) => {
              if (loadEvent.target?.result) {
                let content;

                if (typeof loadEvent.target.result === 'string') {
                  content = loadEvent.target.result;
                } else {
                  const decoder = new TextDecoder();

                  content = decoder.decode(loadEvent.target.result);
                }

                const iCalToJson = iCal.parse(content);
                const component = new iCal.Component(iCalToJson);

                const calendarName = component.getFirstPropertyValue('x-wr-calname');

                const parsedEvents: [string, FullEvent][] = component
                  .getAllSubcomponents('vevent')
                  .map((calendarEvent: { toJSON: () => JsonEvent }) => {
                    const [, event] = calendarEvent.toJSON();

                    const fullEvent: FullEvent = event
                      .reduce((previous, current) => {
                        const [label, , , value] = current;
                        switch (label) {
                          case 'uid': {
                            return {
                              ...previous,
                              id: value,
                            };
                          }
                          case 'dtstart': {
                            return {
                              ...previous,
                              allDay: !value.includes('T'),
                              start: new Date(dayjs(value).utc().format()),
                            };
                          }
                          case 'dtend': {
                            return {
                              ...previous,
                              end: new Date(dayjs(value).utc().format()),
                            };
                          }
                          case 'summary': {
                            return {
                              ...previous,
                              title: value,
                            };
                          }
                          case 'description': {
                            return {
                              ...previous,
                              description: value,
                            };
                          }
                          case 'location': {
                            return {
                              ...previous,
                              location: value,
                            };
                          }
                          case 'rrule': {
                            const { freq, byday, ...rrule } = value;

                            return {
                              ...previous,
                              rrule: {
                                ...rrule,
                                ...(freq && { freq: Frequency[value.freq] }),
                                ...(byday
                                  && {
                                    byweekday: value
                                      .byday
                                      .map((day: WeekdayStr) => Weekday.fromStr(day))
                                  }),
                              },
                            };
                          }
                          default: {
                            return previous;
                          }
                        }
                      }, {} as FullEvent);

                    return [fullEvent.id, fullEvent];
                  })
                  .filter(([, event]: [string, FullEvent]) => (
                    event.id && event.title && event.start && event.end
                  ));

                insert({
                  name: calendarName,
                  events: parsedEvents.map(([, event]) => event),
                  color: randomColor({ luminosity: 'light' }),
                });

                if (inputRef.current) {
                  inputRef.current.value = '';
                }
              }
            });
            reader.readAsText(changeEvent.target.files[0], 'UTF-8');
          }
        }}
      />
    </Container>
  );
};

export default IcalReader;
