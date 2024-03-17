import CloudinaryWrapper from '@/components/CloudinaryWrapper/CloudinaryWrapper';
import {
  romanNumbers,
  Status,
  statusCollection,
} from '@/types/data';
import ListItem from 'components/List/ListItem';
import { Trigger } from 'components/Modal/Modal';
import { CldImage } from 'next-cloudinary';
import React from 'react';
import styled from 'styled-components';
import { colors } from 'styles/global';
import PersonModal from '../../PersonModal/PersonModal';
import {
  PersonListItemProps,
  StatusDiv,
  StyledDiv,
} from './PersonListItem';

const StyledTrigger = styled(Trigger)<{ $status: Status }>`
    width: 100%;
    display: grid;
    border: 2px solid ${({ $status }) => colors[$status] ?? 'transparent'};
    box-shadow: 0 0 3px 1px ${({ $status }) => colors[$status] ?? 'transparent'};
    background-color: ${colors.componentBackground};
    grid-template-areas:
    "photo photo photo"
    "name status status"
    "family society society";
    position: relative;
    padding: .2rem;
    grid-template-columns: 1fr auto 3.5rem;
    grid-gap: .2rem;
    cursor: pointer;
    color: inherit;
`;

const StyledPhoto = styled.div`
    grid-area: photo;
    display: grid;

    img {
        object-fit: cover;
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
    imgVersion,
    _id: id,
  } = person;

  const listItem = (
    <ListItem style={{ backgroundColor: colors.componentBackground }}>
      <StyledTrigger
        aria-label={`${name} ${family}, ${statusCollection[(status as Status)]}, ${society}`}
        $status={status}
      >
        <StyledPhoto>
          <CloudinaryWrapper>
            <CldImage
              config={{
                cloud: {
                  cloudName: window.cloudinaryCloudName,
                },
              }}
              version={imgVersion}
              loading="lazy"
              alt={`${name} ${family}`}
              format="webp"
              src={`olympus/${process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
                ? 'dev/'
                : ''}people/${name.replaceAll(
                /[^\w\d]/g,
                '_',
              )}-${family.replaceAll(
                /[^\w\d]/g,
                '_',
              )}`}
              height={186}
              width={186}
              transformations={['profile']}
            />
          </CloudinaryWrapper>
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
          gridArea: 'status',
          gridAutoFlow: 'column',
        }}>
          <StyledDiv style={{
            justifySelf: 'center',
          }}
          >
            {romanNumbers[year]}
          </StyledDiv>
          <StatusDiv
            $status={status}
            style={{
              justifySelf: 'center',
            }}
          >
            {statusCollection[(status as Status)]}
          </StatusDiv>
        </StyledDiv>
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
    <PersonModal
      personId={id ?? ''}
      trigger={listItem}
    />
  );
};

export default PersonListGridItem;
