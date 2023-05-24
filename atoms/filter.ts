import { atom } from 'recoil';

export type PersonFilterable = 'status' | 'house' | 'society';
export type PersonSortable = 'rank' | 'status' | 'alphabetical' | 'family' | 'society';
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

export const sortByAtom = atom<PersonSortable | undefined>({
  key: 'sortBy',
});

export const listVariantAtom = atom<PersonListVariant | undefined>({
  key: 'listVariant',
  default: 'list',
});
