import { Person } from '@data';
import { usePeople } from '@hooks/people';
import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { sizes } from 'styles/global';
import {
  listVariantAtom,
  PersonListVariant,
  searchStringAtom,
  sortByAtom
} from '../../atoms/filter';
import List from '../List/List';
import PersonListGridItem from './Item/PersonListGridItem';
import PersonListItem from './Item/PersonListItem';

type PersonListProps = {
};

const StyledList = styled(List)`
  grid-column-gap: ${sizes.largeGap};
  grid-gap: .5rem;
  grid-auto-flow: row;
`;

const getFilteredItems = ({
  list,
  searchString, listVariant
}: {
  list: Person[],
  searchString?: string,
  listVariant?: PersonListVariant,
}) => list.reduce((filteredList, person) => {
  if (!searchString || searchString === '' || `${person.name} ${person.family}`.toLowerCase().includes(searchString.toLowerCase())) {
    const Comp = listVariant === 'grid' ? PersonListGridItem : PersonListItem;

    return [
      ...filteredList,
      <Comp key={person._id?.toString() ?? `${person.name}${person.family}`} person={person} />
    ];
  }

  return filteredList;
}, [] as ReactNode[]);

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

  return (
    <StyledList variant={listVariant} aria-label="people">
      {getFilteredItems({ searchString, listVariant, list: sortedPeople })}
    </StyledList>
  );
};

export default PersonList;
