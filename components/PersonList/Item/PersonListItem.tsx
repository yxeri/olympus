import Award from 'assets/award.svg';
import ListItem from 'components/List/ListItem';
import Modal, { Trigger } from 'components/Modal/Modal';
import { CldImage } from 'next-cloudinary';
import React from 'react';
import styled from 'styled-components';
import {
  colors,
  sizes,
} from 'styles/global';
import {
  Person,
  Status,
  statusCollection,
  Year
} from '../../../types/data';

export type PersonListItemProps = {
  person: Person,
};

export const romanNumbers: { [key in Year]: string } = {
  0: '0',
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  99: 'Q',
};

export const StyledDiv = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
`;

const StyledPhoto = styled.div`
  grid-area: photo;
  display: grid;
  min-height: 50px;

  img {
    max-width: 100%;
  }
`;

const StyledListItem = styled(ListItem)<{ status: Status }>`
  display: grid;
  border: 2px solid ${({ status }) => colors[status]};
  box-shadow: 0 0 3px 1px ${({ status }) => colors[status]};
  background-color: ${colors.componentBackground};
  padding: .2rem;
  grid-column-gap: .7rem;
  grid-template-columns: 1fr 1.6rem;
`;

const StyledTrigger = styled(Trigger)`
  background-color: transparent;
  border: none;
  margin: 0;
  padding: 0;
  display: grid;
  align-items: center;
  grid-column-gap: .7rem;
  grid-template-columns: 1.1rem 1.2rem 1fr ${sizes.smallImageHeight[0]};
  grid-template-areas:
    "rank year name photo"
    "rank status name photo"
    "rank status society photo";
`;

export const StatusDiv = styled(StyledDiv)<{ status: Status }>`
  text-shadow: 0 0 2px ${({ status }) => colors[status]};
`;

const PersonListItem: React.FC<PersonListItemProps> = ({ person }) => {
  const {
    year,
    family,
    name,
    status,
    society,
    rank,
    score,
    imgVersion,
  } = person;

  const listItem = (
    <StyledTrigger aria-label={`${name} ${family}, ${statusCollection[(status as Status)]}, ${society}`}>
      <StyledDiv style={{ gridArea: 'rank' }}>
        {rank}
      </StyledDiv>
      <StyledDiv style={{ gridArea: 'year' }}>
        {romanNumbers[year]}
      </StyledDiv>
      <StatusDiv
        status={status}
        style={{ gridArea: 'status' }}
      >
        {statusCollection[status]}
      </StatusDiv>
      <StyledDiv style={{ gridArea: 'name', textTransform: 'capitalize' }}>
        {`${name} ${family.toUpperCase()}`}
      </StyledDiv>
      <StyledDiv style={{ gridArea: 'society' }}>
        {society}
      </StyledDiv>
      <StyledPhoto>
        <CldImage
          version={imgVersion}
          loading="lazy"
          alt={`${name} ${family}`}
          format="webp"
          src={`olympus/${process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? 'dev/' : ''}people/${name.replaceAll(/[^\w\d]/g, '_')}-${family.replaceAll(/[^\w\d]/g, '_')}`}
          height={50}
          width={50}
          transformations={['thumb-person']}
        />
      </StyledPhoto>
    </StyledTrigger>
  );

  return (
    <StyledListItem status={status}>
      <Modal
        trigger={listItem}
        title={`${person.name} ${person.family.toUpperCase()}`}
        description="Description"
        content={<div>Content</div>}
      />
      <Modal
        trigger={(
          <Trigger
            aria-label={`rank ${score}`}
            style={{
              display: 'grid',
              justifyItems: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            <Award style={{ alignSelf: 'center' }} width="14" height="14" />
            <span style={{ alignSelf: 'center' }}>{score}</span>
          </Trigger>
        )}
        title={`${person.name} ${person.family.toUpperCase()}`}
        description="Description"
        content={<div>Content</div>}
      />
    </StyledListItem>
  );
};

export default PersonListItem;
