import { atom } from 'recoil';

export type PersonFilterable = 'status' | 'house' | 'society';
export type PersonSortable = 'rank' | 'status' | 'alphabetical' | 'family' | 'society' | 'year';
export type PersonListVariant = 'list' | 'grid';

export const filterAtom = atom<{ [key in PersonFilterable]: string[] }>({
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

export const sortByAtom = atom<PersonSortable>({
  key: 'sortBy',
  default: 'rank',
});

export const listVariantAtom = atom<PersonListVariant>({
  key: 'listVariant',
  default: 'list',
});
