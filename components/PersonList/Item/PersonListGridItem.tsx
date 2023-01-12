import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import {
  colors,
  sizes,
} from '../../../styles/global';
import ProfilePlaceholder from '../../../assets/profile.png';
import {
  Status,
  statusCollection,
} from '../../../data';
import Modal from '../../Modal/Modal';
import {
  PersonListItemProps,
  romanNumbers,
  StatusDiv,
  StyledDiv,
  StyledPhoto,
} from './PersonListItem';
import ListItem from '../../List/ListItem';

const StyledListItem = styled(ListItem)`
  display: grid;
  border: 2px solid ${({ status }: { status: Status }) => colors[status]};
  box-shadow: 0 0 3px 1px ${({ status }: { status: Status }) => colors[status]};
  background-color: ${colors.componentBackground};
  grid-template-areas:
    "photo photo photo"
    "name year status"
    "family society society"; 
  position: relative;
  padding: .2rem;
  grid-template-columns: 1fr max-content max-content;
  grid-row-gap: .2rem;
`;

const PersonListGridItem: React.FC<PersonListItemProps> = ({ person }) => {
  const {
    year, family, name, status, society,
  } = person;

  const listItem = (
    <StyledListItem status={status} variant="grid" style={{ cursor: 'pointer' }}>
      <StyledPhoto>
        <Image
          placeholder="blur"
          quality={75}
          height={150}
          width={sizes.gridWidth[1]}
          style={{ objectFit: 'cover', alignSelf: 'center' }}
          src={ProfilePlaceholder}
          alt="Person"
        />
      </StyledPhoto>
      <StyledDiv style={{
        gridArea: 'name', justifySelf: 'flex-start',
      }}
      >
        {name}
      </StyledDiv>
      <StyledDiv style={{
        gridArea: 'family', justifySelf: 'flex-start',
      }}
      >
        {family.toUpperCase()}
      </StyledDiv>
      <StyledDiv style={{
        gridArea: 'year', justifySelf: 'flex-end',
      }}
      >
        {romanNumbers[year]}
      </StyledDiv>
      <StatusDiv
        status={status}
        style={{
          gridArea: 'status', justifySelf: 'flex-end',
        }}
      >
        {statusCollection[status]}
      </StatusDiv>
      <StyledDiv style={{
        gridArea: 'society', justifySelf: 'flex-end',
      }}
      >
        {society}
      </StyledDiv>
    </StyledListItem>
  );

  return (
    <Modal
      trigger={listItem}
      title={`${person.name} ${person.family.toUpperCase()}`}
      description="Description"
      content={<div>Content</div>}
    />
  );
};

export default PersonListGridItem;
