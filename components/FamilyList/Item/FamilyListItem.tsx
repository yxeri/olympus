import ListItem from 'components/List/ListItem';
import { Trigger } from 'components/Modal/Modal';
import { CldImage } from 'next-cloudinary';
import React from 'react';
import styled from 'styled-components';
import {
  colors,
  sizes,
} from 'styles/global';
import {
  Family,
  Status,
  statusCollection,
} from '@/types/data';
import PersonModal from '../../PersonModal/PersonModal';

export type FamilyListItemProps = {
  family: Family,
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

const StyledListItem = styled(ListItem)<{ $status: Status }>`
  display: grid;
  border: 2px solid ${({ $status }) => colors[$status] ?? 'transparent'};
  box-shadow: 0 0 3px 1px ${({ $status }) => colors[$status] ?? 'transparent'};
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

export const StatusDiv = styled(StyledDiv)<{ $status: Status }>`
  text-shadow: 0 0 2px ${({ $status }) => colors[$status]};
`;

const FamilyListItem: React.FC<FamilyListItemProps> = ({ family }) => {
  const {
    name,
    status,
    imgVersion,
    _id: id,
  } = family;

  const listItem = (
    <StyledTrigger aria-label={`${family}, ${statusCollection[(status as Status)]}`}>
      <StatusDiv
        $status={status}
        style={{ gridArea: 'status' }}
      >
        {statusCollection[status]}
      </StatusDiv>
      <StyledDiv style={{
        gridArea: 'name',
        textTransform: 'capitalize',
      }}>
        {`${name}}`}
      </StyledDiv>
      <StyledPhoto>
        <CldImage
          version={imgVersion}
          loading="lazy"
          alt={`${name} ${family}`}
          format="webp"
          src={`olympus/${process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
            ? 'dev/'
            : ''}families/${name.replaceAll(
            /[^\w\d]/g,
            '_',
          )}`}
          height={50}
          width={50}
          transformations={['thumb-person']}
        />
      </StyledPhoto>
    </StyledTrigger>
  );

  return (
    <StyledListItem $status={status}>
      <PersonModal
        trigger={listItem}
        personId={id ?? ''}
      />
    </StyledListItem>
  );
};

export default FamilyListItem;
