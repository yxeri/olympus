import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { usePeople } from '../../hooks/people';
import {
  Family,
  statusCollection,
} from '../../types/data';
import Container from '../Container/Container';
import List from '../List/List';
import ListItem from '../List/ListItem';
import Modal from '../Modal/Modal';

const Text = styled.p`
  padding: 0;
  margin: 0;
`;

const StyledContainer = styled(Container)`
  display: grid;
  grid-gap: .5rem;
`;

const FamilyModal = ({
  trigger,
  family,
}: {
  trigger: ReactNode,
  family: Partial<Family>,
}) => {
  const { people } = usePeople();

  const listItems = people
    .filter((person) => person.family === family.name)
    .map((person) => (
      <ListItem style={{ textTransform: 'capitalize' }}>{`${person.name} ${person.family}`}</ListItem>
    ));

  return (
    <Modal
      trigger={trigger}
      title={`${family.name}`}
      content={(
        <StyledContainer>
          {family?.status && (<Text style={{ fontSize: '1.5rem' }}>{`${statusCollection[family?.status]}`}</Text>)}
          <List>
            {listItems}
          </List>
        </StyledContainer>
      )}
    />
  );
};

export default FamilyModal;
