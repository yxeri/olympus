import React from 'react';
import styled from 'styled-components';
import { Person, } from 'data';
import { sizes } from 'styles/global';
import { usePeople } from '@hooks/people';
import { useRecoilValue } from 'recoil';
import List from '../List/List';
import PersonListGridItem from './Item/PersonListGridItem';
import PersonListItem from './Item/PersonListItem';
import {
  listVariantAtom,
  searchStringAtom,
  sortByAtom
} from '../../atoms/filter';

type PersonListProps = {
};

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

const PersonList: React.FC<PersonListProps> = () => {
  const listVariant = useRecoilValue(listVariantAtom);
  const sortBy = useRecoilValue(sortByAtom);
  const searchString = useRecoilValue(searchStringAtom);
  const { people } = usePeople();

  const sortedPeople = [...people].sort((a, b) => {
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
  });
  const personItems = getFilteredList({ searchString, list: sortedPeople })
    .map((person) => (
      listVariant === 'grid'
        ? <PersonListGridItem key={person._id ?? `${person.name}${person.family}`} person={person} />
        : <PersonListItem key={person._id ?? `${person.name}${person.family}`} person={person} />
    ));

  return (
    <StyledList variant={listVariant}>
      {personItems}
    </StyledList>
  );
};

export default PersonList;
