import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { sizes } from 'styles/global';
import {
  PersonListVariant,
  searchStringAtom,
  sortByAtom
} from '../../atoms/filter';
import { usePeople } from '../../hooks/people';
import { Person } from '../../types/data';
import List from '../List/List';
import FamilyListGridItem from './Item/FamilyListGridItem';
import FamilyListItem from './Item/FamilyListItem';

type FamilyListProps = {};

const StyledList = styled(List)`
  grid-column-gap: ${sizes.largeGap};
  grid-gap: .5rem;
  grid-auto-flow: row;
`;

const getFilteredItems = ({
  list,
  searchString,
  listVariant
}: {
  list: Array<{ name: string, status: Person['status'] }>,
  searchString?: string,
  listVariant?: PersonListVariant,
}) => list.reduce((filteredList, family) => {
  if (!searchString || searchString === '' || family.name.toLowerCase().includes(searchString.toLowerCase())) {
    const Comp = listVariant === 'grid' ? FamilyListGridItem : FamilyListItem;

    return [
      ...filteredList,
      <Comp key={family.name} family={family} />
    ];
  }

  return filteredList;
}, [] as ReactNode[]);

const FamilyList: React.FC<FamilyListProps> = () => {
  const sortBy = useRecoilValue(sortByAtom);
  const searchString = useRecoilValue(searchStringAtom);
  const { people } = usePeople();

  const sortedPeople = [...people].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      const aName = a.family;
      const bName = b.family;

      if (aName === bName) {
        return 0;
      }

      return aName > bName ? 1 : -1;
    }

    if ((a[sortBy] && b[sortBy]) && a[sortBy] === b[sortBy]) {
      return 0;
    }

    return (a[sortBy] && b[sortBy]) && (a[sortBy] as string) > (b[sortBy] as string) ? 1 : -1;
  });

  const families = new Set(sortedPeople.map((person) => ({
    name: person.family,
    status: person.status,
  })));

  return (
    <StyledList $variant="grid" aria-label="families">
      {getFilteredItems({ searchString, listVariant: 'grid', list: Array.from(families) })}
    </StyledList>
  );
};

export default FamilyList;
