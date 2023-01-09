import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { discipli } from '../../data';
import PersonListItem from './Item/PersonListItem';
import List from '../List/List';
import { listVariantAtom, sortByAtom } from '../Filter/atoms';

const StyledList = styled(List)`
  grid-column-gap: 1rem;
  grid-gap: .5rem;
  grid-auto-flow: row;
`;

const PersonList = () => {
  const sortBy = useRecoilValue(sortByAtom);
  const listVariant = useRecoilValue(listVariantAtom);
  const persons = discipli.sort((a, b) => {
    if (!sortBy || sortBy === 'alphabetical') {
      if (a.rank === b.rank) {
        return 0;
      }

      return a.rank > b.rank ? 1 : -1;
    }

    if (a[sortBy] === b[sortBy]) {
      return 0;
    }

    return a[sortBy] > b[sortBy] ? 1 : -1;
  }).map((person) => <PersonListItem key={person.id} person={person} listVariant={listVariant} />);

  return (
    <StyledList variant={listVariant}>
      {persons}
    </StyledList>
  );
};

export default PersonList;
