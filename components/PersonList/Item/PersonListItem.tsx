import {
  AdvancedImage,
  lazyload
} from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import {
  Person,
  Status,
  statusCollection,
  Year,
} from '@data';
import Award from 'assets/award.svg';
import ListItem from 'components/List/ListItem';
import Modal, { Trigger } from 'components/Modal/Modal';
import React from 'react';
import styled from 'styled-components';
import {
  colors,
  sizes,
} from 'styles/global';

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

const StyledListItem = styled(ListItem)`
  display: grid;
  border: 2px solid ${({ status }: { status: Status }) => colors[status]};
  box-shadow: 0 0 3px 1px ${({ status }: { status: Status }) => colors[status]};
  background-color: ${colors.componentBackground};
  max-width: ${sizes.mediumMax};
  padding: .2rem;
  grid-column-gap: .7rem;
  grid-template-columns: 1fr 1.6rem;
`;

const StyledTrigger = styled(Trigger)`
  display: grid;
  align-items: center;
  grid-column-gap: .7rem;
  grid-template-columns: 1.1rem 1.2rem 1fr ${sizes.smallImageHeight[0]};
  grid-template-areas:
    "rank year name photo"
    "rank status name photo"
    "rank status society photo";
`;

export const StatusDiv = styled(StyledDiv)`
  text-shadow: 0 0 2px ${({ status }: { status: Status }) => colors[status]};  
`;

const PersonListItem: React.FC<PersonListItemProps> = ({ person }) => {
  const {
    year, family, name, status, society, rank, score,
  } = person;

  const image = new CloudinaryImage(`olympus/people/${name}-${family}`, {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  }).addTransformation('t_thumb-person');

  const listItem = (
    <StyledTrigger>
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
        <AdvancedImage cldImg={image} plugins={[lazyload()]} alt={`${name} ${family}`} />
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
          <Trigger style={{
            display: 'grid',
            cursor: 'pointer',
            justifyItems: 'center',
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
