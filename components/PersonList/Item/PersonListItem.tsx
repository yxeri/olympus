import React from 'react';
import styled from 'styled-components';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import ListItem from '../../List/ListItem';
import {
  Person,
  Status,
  statusCollection,
  Year,
} from '../../../data';
import Modal from '../../Modal/Modal';
import {
  colors,
  sizes,
} from '../../../styles/global';
import Award from '../../../assets/award.svg';

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

export const StyledPhoto = styled.div`
  grid-area: photo;
  display: grid;
  
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
  grid-template-areas:
    "rank year name photo score"
    "rank status name photo score"
    "rank status society photo score";
  grid-template-columns: 1.1rem 1.2rem 1fr ${sizes.smallImageHeight[0]} 1.6rem;
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
      <StyledPhoto>
        <AdvancedImage cldImg={image} />
      </StyledPhoto>
    </div>
  );

  return (
    <StyledListItem status={status} variant="list">
      <Modal
        trigger={listItem}
        title={`${person.name} ${person.family.toUpperCase()}`}
        description="Description"
        content={<div>Content</div>}
      />
      <Modal
        trigger={(
          <StyledDiv style={{ gridArea: 'score', cursor: 'pointer' }}>
            <Award width="14" height="14" />
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
