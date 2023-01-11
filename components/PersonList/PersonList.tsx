import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import {
  discipli,
  Person,
} from '../../data';
import PersonListItem from './Item/PersonListItem';
import List from '../List/List';
import {
  listVariantAtom,
  searchStringAtom,
  sortByAtom,
} from '../Filter/atoms';
import { sizes } from '../../styles/global';

const StyledList = styled(List)`
  grid-column-gap: ${sizes.largeGap};
  grid-gap: .5rem;
  grid-auto-flow: row;
`;

const getFilteredList = ({ list, searchString }: { list: Person[], searchString?: string }) => (
  searchString
    ? list
      .filter(({ name, family }) => searchString === '' || `${name} ${family}}`
        .toLowerCase()
        .includes(searchString.toLowerCase()))
    : list
);

const PersonList = () => {
  const sortBy = useRecoilValue(sortByAtom);
  const listVariant = useRecoilValue(listVariantAtom);
  const searchString = useRecoilValue(searchStringAtom);
  const persons = getFilteredList({ searchString, list: discipli })
    .sort((a, b) => {
      if (sortBy === 'alphabetical') {
        const aName = `${a.name} ${a.family}`;
        const bName = `${b.name} ${b.family}`;

        if (aName === bName) {
          return 0;
        }

        return aName > bName ? 1 : -1;
      }

      if (a[sortBy] === b[sortBy]) {
        return 0;
      }

      return a[sortBy] > b[sortBy] ? 1 : -1;
    })
    .map((person) => <PersonListItem key={`${person.name}${person.family}`} person={person} listVariant={listVariant} />);

  return (
    <StyledList variant={listVariant}>
      {persons}
    </StyledList>
  );
};

export default PersonList;
