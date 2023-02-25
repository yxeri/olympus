import {
  useRecoilState,
  useSetRecoilState
} from 'recoil';
// @ts-ignore
import iCal from 'ical.js';
import {
  calendarEventsAtom,
  calendarsAtom,
  FullCalendarEvent,
  RecurDay
} from 'atoms/calendar';

// [
//     [
//         "dtstart",
//         {},
//         "date",
//         "2022-07-29"
//     ],
//     [
//         "dtend",
//         {},
//         "date",
//         "2022-08-02"
//     ],
//     [
//         "dtstamp",
//         {},
//         "date-time",
//         "2023-01-22T12:44:40Z"
//     ],
//     [
//         "uid",
//         {},
//         "text",
//         "19lik0r8qdfj6mfoe0n7g7j0vj@google.com"
//     ],
//     [
//         "created",
//         {},
//         "date-time",
//         "2022-07-22T18:11:40Z"
//     ],
//     [
//         "description",
//         {},
//         "text",
//         ""
//     ],
//     [
//         "last-modified",
//         {},
//         "date-time",
//         "2022-07-22T18:11:40Z"
//     ],
//     [
//         "location",
//         {},
//         "text",
//         ""
//     ],
//     [
//         "sequence",
//         {},
//         "integer",
//         0
//     ],
//     [
//         "status",
//         {},
//         "text",
//         "CONFIRMED"
//     ],
//     [
//         "summary",
//         {},
//         "text",
//         "Värmland"
//     ],
//     [
//         "transp",
//         {},
//         "text",
//         "TRANSPARENT"
//     ]
// ]

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
  const setCalendarEvents = useSetRecoilState(calendarEventsAtom);
  const [calendars, setCalendars] = useRecoilState(calendarsAtom);

  return (
    <div>
      <input
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

                const parsedEvents: [string, FullCalendarEvent][] = component
                  .getAllSubcomponents('vevent')
                  .map((calendarEvent: { toJSON: () => JsonEvent }) => {
                    const [, event] = calendarEvent.toJSON();

                    const fullCalendarEvent: FullCalendarEvent = event
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
                              start: value,
                            };
                          }
                          case 'dtend': {
                            return {
                              ...previous,
                              end: value,
                            };
                          }
                          case 'summary': {
                            return {
                              ...previous,
                              title: value,
                            };
                          }
                          case 'rrule': {
                            const rrule: {
                              byday?: keyof typeof RecurDay | Array<keyof typeof RecurDay>,
                              until?: string,
                              freq: 'DAILY' | 'WEEKLY' | 'YEARLY',
                            } = value;

                            // Current implementation only supports daily, weekly recurring events
                            if (!['DAILY', 'WEEKLY'].includes(rrule.freq)) {
                              return previous;
                            }

                            const rules: { daysOfWeek?: RecurDay[], endRecur?: string } = {
                              endRecur: rrule.until,
                            };

                            if (rrule.byday) {
                              if (Array.isArray(rrule.byday)) {
                                rules.daysOfWeek = rrule.byday.map((day) => RecurDay[day]);
                              } else {
                                rules.daysOfWeek = [RecurDay[rrule.byday]];
                              }
                            }

                            return {
                              ...previous,
                              ...rules,
                              extendedProps: {
                                ...previous.extendedProps,
                                recurring: true,
                              }
                            };
                          }
                          default: {
                            return previous;
                          }
                        }
                      }, {
                        extendedProps: { calendarId: calendarName, recurring: false },
                      } as FullCalendarEvent);

                    if (fullCalendarEvent.extendedProps.recurring) {
                      fullCalendarEvent.startRecur = fullCalendarEvent.start;

                      if (!fullCalendarEvent.allDay) {
                        [, fullCalendarEvent.startTime] = fullCalendarEvent.start.split('T');
                        [, fullCalendarEvent.endTime] = fullCalendarEvent.end.split('T');
                      }
                    }

                    return [fullCalendarEvent.id, fullCalendarEvent];
                  })
                  .filter(([, event]: [string, FullCalendarEvent]) => (
                    event.id && event.title && event.start && event.end
                  ));

                const calendarMap = new Map(calendars);

                calendarMap.set(calendarName, { name: calendarName });

                setCalendars(calendarMap);
                setCalendarEvents(new Map(parsedEvents));
              }
            });
            reader.readAsText(changeEvent.target.files[0], 'UTF-8');
          }
        }}
      />
    </div>
  );
};

export default IcalReader;
