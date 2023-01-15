import { atom } from 'recoil';
import { Person } from '../data';

export const peopleAtom = atom<Person[]>({
  key: 'people',
  default: [],
});
