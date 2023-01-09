import React from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import ListItem from '../../List/ListItem';
import {
  Person, Status, statusCollection,
  Year,
} from '../../../data';
import { ListVariants } from '../../List/List';
import { PersonListVariants } from '../../Filter/atoms';

type PersonListItemProps = {
  person: Person,
  listVariant?: ListVariants,
};

const romanNumbers: { [key in Year]: string } = {
  0: '0',
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  99: 'Q',
};

const borderColors: { [key in Status]: string } = {
  a: '#eabb00',
  b: '#858484',
  g: 'transparent',
  d: 'transparent',
  e: 'transparent',
  '?': 'transparent',
};

const StyledDiv = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
`;

const photoVariants = (variant?: ListVariants) => {
  if (variant === 'grid') {
    return css`
      height: 150px;
    `;
  }

  return css`
    margin: -.2rem 0;
    height: 50px;
  `;
};

const StyledPhoto = styled(StyledDiv)<{ variant?: ListVariants }>`
  grid-area: photo;
  overflow: hidden;
  position: relative;
  ${({ variant }) => photoVariants(variant)}
`;

const listVariants = (variant?: PersonListVariants) => {
  if (variant === 'grid') {
    return css`
      grid-template-areas:
        "photo photo photo"
        "name year status"
        "family society society";
      position: relative;
      padding: .2rem;
      grid-template-columns: 1fr max-content max-content;
      grid-row-gap: .2rem;
    `;
  }

  return css`
    padding: .3rem;
    grid-column-gap: .7rem;
    grid-template-areas:
    "rank year name photo score"
    "rank status name photo score"
    "rank status society photo score";
    grid-template-columns: 1.1rem 1.2rem 1fr 50px 1.6rem;
  `;
};

const StyledListItem = styled(ListItem)`
  display: grid;
  border: 2px solid ${({ status }: { status: Status }) => borderColors[status]};
  box-shadow: 0 0 3px 1px ${({ status }: { status: Status }) => borderColors[status]};
  background-color: #ccc7b5;
  ${({ variant }) => listVariants(variant)}
`;

const StatusDiv = styled(StyledDiv)`
  text-shadow: 0 0 2px ${({ status }: { status: Status }) => borderColors[status]};  
`;

const PersonListItem: React.FC<PersonListItemProps> = ({ person, listVariant }) => {
  const {
    year, family, name, status, society, rank, score,
  } = person;

  if (listVariant === 'grid') {
    return (
      <StyledListItem status={status} variant={listVariant}>
        <StyledPhoto variant={listVariant}>
          <Image
            fill
            style={{ objectFit: 'cover' }}
            src="/profile.png"
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
  }

  return (
    <StyledListItem status={status} variant={listVariant}>
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
      <StyledDiv style={{ gridArea: 'name' }}>
        {`${name} ${family.toUpperCase()}`}
      </StyledDiv>
      <StyledDiv style={{ gridArea: 'society' }}>
        {society}
      </StyledDiv>
      <StyledPhoto variant={listVariant}>
        <Image
          fill
          style={{ objectFit: 'cover' }}
          src="/profile.png"
          alt="Person"
        />
      </StyledPhoto>
      <StyledDiv style={{ gridArea: 'score' }}>
        <Image src="/award.svg" alt="Score" width={14} height={14} />
        {score}
      </StyledDiv>
    </StyledListItem>
  );
};

export default PersonListItem;
