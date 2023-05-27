import { ReactNode } from 'react';
import { Event } from 'react-big-calendar';
import { atom } from 'recoil';
import { Options } from 'rrule';

export type FullEvent = Event & {
  start: Date;
  end: Date;
  title: ReactNode;
  id: string;
  description?: string;
  location?: string;
  rrule?: Partial<Options>;
};

export const calendarEventsAtom = atom<Map<string, FullEvent>>({
  key: 'calendarEvents',
  default: new Map([['8494DF0B-DBE8-476F-8C5A-E48D0B1CF6A8', {
    id: '8494DF0B-DBE8-476F-8C5A-E48D0B1CF6A8',
    title: 'Historia & Litteratur (Patronessan)',
    start: new Date('2023-01-05T10:30:00'),
    end: new Date('2023-01-05T11:15:00'),
    allDay: false,
  }], ['6CDBD384-D071-4B99-A095-E244E9617BCB', {
    id: '6CDBD384-D071-4B99-A095-E244E9617BCB',
    title: 'Retorik (Brukspatronen)',
    start: new Date('2023-01-06T10:30:00'),
    end: new Date('2023-01-06T11:15:00'),
    allDay: false,
  }]]),
});

export const calendarsAtom = atom<Map<string, { name: string; color?: string }>>({
  key: 'calendars',
  default: new Map([['test', { name: 'test' }]]),
});
