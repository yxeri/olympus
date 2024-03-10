import { ObjectId } from 'mongodb';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { usePeople } from '../../hooks/people';
import {
  romanNumbers,
  statusCollection,
} from '@/types/data';
import Container from '../Container/Container';
import Modal from '../Modal/Modal';

const Text = styled.p`
  padding: 0;
  margin: 0;
`;

const StyledContainer = styled(Container)`
  display: grid;
  grid-gap: .5rem;
`;

const PersonModal = ({
  trigger,
  personId,
}: {
  trigger: ReactNode,
  personId: ObjectId | string,
}) => {
  // FIXME Use usePerson
  const { people } = usePeople();
  const person = people
    .find((foundPerson) => foundPerson._id?.toString() === personId.toString());

  return (
    <Modal
      trigger={trigger}
      title={`${person?.name} ${person?.family.toUpperCase()}`}
      content={(
        <StyledContainer>
          {person?.status && (<Text style={{ fontSize: '1.5rem' }}>{`${statusCollection[person?.status]}`}</Text>)}
          {person?.rank && <Text>{`Rank: ${person.rank.toString()}`}</Text>}
          {person?.year && person.year < 5 && <Text>{`År: ${romanNumbers[person.year]}`}</Text>}
          {person?.pronouns &&
              <Text style={{ textTransform: 'capitalize' }}>{`Pronomen: ${person.pronouns.join('/')}`}</Text>}
          {person?.age && <Text>{`Ålder: ${person.age.toString()}`}</Text>}
          {person?.province && <Text style={{ textTransform: 'capitalize' }}>{`Provins: ${person?.province}`}</Text>}
          {person?.society && <Text>{`Elevhem: ${person?.society}`}</Text>}
          {person?.type && <Text>{`Titel: ${person?.type}${person?.specialisation
            ? `, ${person.specialisation}`
            : ''}`}</Text>}
        </StyledContainer>
      )}
    />
  );
};

export default PersonModal;
