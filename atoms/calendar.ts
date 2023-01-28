import { atom } from 'recoil';

export enum RecurDay {
  SU,
  MO,
  TU,
  WE,
  TH,
  FR,
  SA,
}

export type FullCalendarEvent = {
  id: string;
  start: string;
  end: string;
  title: string;
  allDay: boolean;
  endRecur?: string;
  startRecur?: string;
  daysOfWeek?: RecurDay[];
  endTime?: string;
  startTime?: string;
  extendedProps: {
    calendarId: string;
    recurring: boolean;
  };
};

export const calendarEventsAtom = atom<Map<string, FullCalendarEvent>>({
  key: 'calendarEvents',
  default: new Map([
    ['8494DF0B-DBE8-476F-8C5A-E48D0B1CF6A8', {
      id: '8494DF0B-DBE8-476F-8C5A-E48D0B1CF6A8',
      title: 'Historia & Litteratur (Patronessan)',
      start: '2023-01-05T10:30:00',
      end: '2023-01-05T11:15:00',
      allDay: false,
      extendedProps: {
        recurring: false,
        calendarId: 'test'
      },
    }],
    ['6CDBD384-D071-4B99-A095-E244E9617BCB', {
      id: '6CDBD384-D071-4B99-A095-E244E9617BCB',
      title: 'Retorik (Brukspatronen)',
      start: '2023-01-06T10:30:00',
      end: '2023-01-06T11:15:00',
      allDay: false,
      extendedProps: {
        recurring: false,
        calendarId: 'test'
      },
    }]]),
});

export const calendarsAtom = atom<Map<string, { name: string; color?: string }>>({
  key: 'calendars',
  default: new Map([['test', { name: 'test' }]]),
});
