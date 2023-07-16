import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import KeyIcon from '../../assets/key.svg';
import { sessionAtom } from '../../atoms/session';
import {
  colors,
  sizes
} from '../../styles/global';
import Container from '../Container/Container';
import Modal, { Trigger } from '../Modal/Modal';
import LoginContent from './content/LoginContent';
import { AuthState } from './types';

const StyledTrigger = () => (
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
  }}
  >
    <Trigger style={{
      color: colors.brightColor,
      border: `1px solid ${colors.brightColor}`,
      borderRadius: '25%',
      backgroundColor: colors.primaryBackground,
      padding: '.25rem',
      margin: 0,
      display: 'grid',
    }}
    >
      <KeyIcon style={{
        strokeWidth: 1.5,
        width: sizes.hugeIcon,
        height: sizes.hugeIcon,

      }}
      />
    </Trigger>
  </Container>
);

const Auth = () => {
  const [authState, setAuthState] = useState<AuthState>('LOGIN');
  const session = useRecoilValue(sessionAtom);

  if (session) {
    return null;
  }

  const title = (() => {
    if (authState === 'REGISTER') {
      return 'Register';
    }

    if (authState === 'OTP') {
      return 'One-time password';
    }

    return 'Login';
  })();

  return (
    <Modal
      onOpenChange={(open) => open && setAuthState('LOGIN')}
      trigger={<StyledTrigger />}
      title={title}
      content={<LoginContent setAuthState={setAuthState} />}
    />
  );
};

export default Auth;
