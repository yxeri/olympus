import React from 'react';
import styled from 'styled-components';
import { usePeople } from '../../hooks/people';
import Button from '../Button/Button';
import ComboBox from '../ComboBox/ComboBox';

const StyledContainer = styled.div`
  display: grid;
  width: fit-content;
  grid-gap: 1rem;
`;

const AccessSelect = () => {
  const { people } = usePeople();

  return (
    <StyledContainer>
      <ComboBox
        name="read"
        trigger={<Button>Rättigheter att läsa</Button>}
        items={people.map((person) => ({
          id: person._id.toString(),
          name: `${person.name} ${person.family}`,
        }))}
      />
      <ComboBox
        name="post"
        trigger={<Button>Rättigheter att skriva</Button>}
        items={people.map((person) => ({
          id: person._id.toString(),
          name: `${person.name} ${person.family}`,
        }))}
      />
    </StyledContainer>
  );
};

export default AccessSelect;
