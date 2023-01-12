import { atom } from 'recoil';

export type PersonFilterables = 'status' | 'house' | 'society';
export type PersonSortables = 'rank' | 'status' | 'alphabetical' | 'family' | 'society';
export type PersonListVariants = 'list' | 'grid';

export const filterAtom = atom<{ [key in PersonFilterables]: string[] }>({
  key: 'filter',
  default: {
    status: [],
    house: [],
    society: [],
  },
});

export const searchStringAtom = atom<string>({
  key: 'searchString',
  default: '',
});

export const sortByAtom = atom<PersonSortables>({
  key: 'sortBy',
  default: 'rank',
});
