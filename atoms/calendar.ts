import { atom } from 'recoil';

export const selectedCalendarsAtom = atom<string[]>({
  key: 'selectedCalendar',
  default: ['all'],
});
