import {
  AdvancedImage,
  lazyload,
  placeholder
} from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import {
  Status,
  statusCollection,
} from '@data';
import ListItem from 'components/List/ListItem';
import Modal, { Trigger } from 'components/Modal/Modal';
import React from 'react';
import styled from 'styled-components';
import { colors } from 'styles/global';
import {
  PersonListItemProps,
  romanNumbers,
  StatusDiv,
  StyledDiv,
} from './PersonListItem';

const StyledTrigger = styled(Trigger)`
  width: 100%;
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
  grid-template-columns: 1fr auto auto;
  grid-gap: .2rem;
`;

const StyledPhoto = styled.div`
  grid-area: photo;
  display: grid;
  height: 176px;
  
  img {
    max-width: 100%;
  }
`;

const PersonListGridItem: React.FC<PersonListItemProps> = ({ person }) => {
  const {
    year,
    family,
    name,
    status,
    society,
  } = person;

  const image = new CloudinaryImage(`olympus/people/${name}-${family}`, {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  }).addTransformation('t_profile');

  const listItem = (
    <ListItem>
      <StyledTrigger
        aria-label={`${name} ${family}, ${statusCollection[(status as Status)]}, ${society}`}
        status={status}
        style={{ cursor: 'pointer' }}
      >
        <StyledPhoto>
          <AdvancedImage cldImg={image} plugins={[lazyload(), placeholder()]} alt={`${name} ${family}`} />
        </StyledPhoto>
        <StyledDiv style={{
          gridArea: 'name',
          justifySelf: 'flex-start',
          textTransform: 'capitalize',
        }}
        >
          {name}
        </StyledDiv>
        <StyledDiv style={{
          gridArea: 'family',
          justifySelf: 'flex-start',
          textTransform: 'uppercase',
        }}
        >
          {family}
        </StyledDiv>
        <StyledDiv style={{
          gridArea: 'year', justifySelf: 'center',
        }}
        >
          {romanNumbers[year]}
        </StyledDiv>
        <StatusDiv
          status={status}
          style={{
            gridArea: 'status', justifySelf: 'center',
          }}
        >
          {statusCollection[(status as Status)]}
        </StatusDiv>
        <StyledDiv
          style={{
            width: '100%',
            gridArea: 'society',
            justifySelf: 'flex-end',
            overflow: 'hidden',
          }}
        >
          {society}
        </StyledDiv>
      </StyledTrigger>
    </ListItem>
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
