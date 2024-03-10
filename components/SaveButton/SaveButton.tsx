import React from 'react';
import useAuthPerson from '../../hooks/people/useAuthPerson';
import {
  colors,
  sizes,
} from '@/styles/global';
import Button from '../Button/Button';
import Container from '../Container/Container';

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
    <Button
      type="submit"
      style={{
        color: colors.brightColor,
        border: `1px solid ${colors.brightColor}`,
        borderRadius: '10%',
        backgroundColor: colors.primaryBackground,
        display: 'grid',
        filter: 'drop-shadow(2px 2px 5px #000000)',
      }}
    >
      Spara
    </Button>
  </Container>
);

const SaveButton = () => {
  const { person } = useAuthPerson();

  if (!person || (!person.auth?.all?.admin && !person.auth?.score?.admin)) {
    return null;
  }

  return <StyledContainer/>;
};

export default SaveButton;
