import {
  colors,
  sizes,
} from '@/styles/global';
import React from 'react';
import PlusIcon from '../../assets/plus-circle.svg';
import useAuthPerson from '../../hooks/people/useAuthPerson';
import Container from '../Container/Container';
import Link from '../Link/Link';

const StyledContainer = () => (
  <Container style={{
    boxSizing: 'border-box',
    display: 'grid',
    justifyItems: 'flex-end',
    paddingRight: sizes.largeGap,
    position: 'sticky',
    bottom: '2rem',
    marginTop: '.5rem',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: sizes.mediumMax,
    maxWidth: '100%',
    color: colors.brightColor,
    zIndex: 2,
    right: 0,
  }}
  >
    <Link
      href="/people/edit-score"
      style={{
        color: colors.brightColor,
        border: `1px solid ${colors.brightColor}`,
        borderRadius: '25%',
        backgroundColor: colors.primaryBackground,
        padding: '.25rem',
        margin: 0,
        display: 'grid',
        filter: 'drop-shadow(2px 2px 5px #000000)',
      }}
    >
      <PlusIcon width={sizes.hugeIcon} height={sizes.hugeIcon}/>
    </Link>
  </Container>
);

const EditScoreButton = () => {
  const { person } = useAuthPerson();

  if (!person || (!person.auth?.all?.admin && !person.auth?.score?.admin)) {
    return null;
  }

  return <StyledContainer/>;
};

export default EditScoreButton;
