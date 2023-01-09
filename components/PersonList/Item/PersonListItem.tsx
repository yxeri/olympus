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
import Modal from '../../Modal/Modal';
import {
  colors,
  sizes,
} from '../../../styles/global';

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
    height: ${sizes.smallImageHeight};
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
    grid-template-columns: 1.1rem 1.2rem 1fr ${sizes.smallImageHeight} 1.6rem;
  `;
};

const StyledListItem = styled(ListItem)`
  display: grid;
  border: 2px solid ${({ status }: { status: Status }) => colors[status]};
  box-shadow: 0 0 3px 1px ${({ status }: { status: Status }) => colors[status]};
  background-color: ${colors.componentBackground};
  ${({ variant }) => listVariants(variant)}
`;

const StatusDiv = styled(StyledDiv)`
  text-shadow: 0 0 2px ${({ status }: { status: Status }) => colors[status]};  
`;

const PersonListItem: React.FC<PersonListItemProps> = ({ person, listVariant }) => {
  const {
    year, family, name, status, society, rank, score,
  } = person;

  if (listVariant === 'grid') {
    const listItem = (
      <StyledListItem status={status} variant={listVariant} style={{ cursor: 'pointer' }}>
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

    return (
      <Modal
        trigger={listItem}
        title={`${person.name} ${person.family.toUpperCase()}`}
        description="Description"
        content={<div>Content</div>}
      />
    );
  }

  const listItem = (
    <div style={{ display: 'contents', cursor: 'pointer' }}>
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
    </div>
  );

  return (
    <StyledListItem status={status} variant={listVariant}>
      <Modal
        trigger={listItem}
        title={`${person.name} ${person.family.toUpperCase()}`}
        description="Description"
        content={<div>Content</div>}
      />
      <Modal
        trigger={(
          <StyledDiv style={{ gridArea: 'score', cursor: 'pointer' }}>
            <Image src="/award.svg" alt="Score" width={14} height={14} />
            {score}
          </StyledDiv>
        )}
        title="Title"
        content="content"
      />
    </StyledListItem>
  );
};

export default PersonListItem;
