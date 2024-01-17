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
import useAuthPerson from '../../hooks/people/useAuthPerson';
import { Person } from '../../types/data';
import List from '../List/List';
import EditPersonScoreListItem from './Item/EditPersonScoreListItem';

type PersonListProps = {};

const StyledList = styled(List)`
  grid-column-gap: ${sizes.largeGap};
  grid-gap: .5rem;
  grid-auto-flow: row;
`;

const getFilteredItems = ({
  list,
  searchString,
}: {
  list: Person[],
  searchString?: string,
  listVariant?: PersonListVariant,
}) => list.reduce((filteredList, person) => {
  if (
    !searchString
    || searchString === ''
    || `${person.name} ${person.family}`.toLowerCase().includes(searchString.toLowerCase())
    || Number(searchString) === person.year
  ) {
    return [
      ...filteredList,
      <EditPersonScoreListItem key={person._id?.toString() ?? `${person.name}${person.family}`} person={person} />
    ];
  }

  return filteredList;
}, [] as ReactNode[]);

const EditPersonScoreList: React.FC<PersonListProps> = () => {
  const sortBy = useRecoilValue(sortByAtom);
  const searchString = useRecoilValue(searchStringAtom);
  const { people } = usePeople();
  const { person } = useAuthPerson();

  const sortedPeople = [...people].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      const aName = `${a.name} ${a.family}`;
      const bName = `${b.name} ${b.family}`;

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

  if (!person || (!person.auth?.score?.admin && !person.auth?.all?.admin)) {
    return null;
  }

  return (
    <StyledList $variant="list" aria-label="people">
      {getFilteredItems({ searchString, list: sortedPeople })}
    </StyledList>
  );
};

export default EditPersonScoreList;
