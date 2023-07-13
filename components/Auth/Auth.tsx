import KeyIcon from '@assets/key.svg';
import { Modal } from '@components';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { sessionAtom } from '../../atoms/session';
import {
  colors,
  sizes
} from '../../styles/global';
import Container from '../Container/Container';
import { Trigger } from '../Modal/Modal';
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
  }}
  >
    <Trigger>
      <KeyIcon style={{
        justifySelf: 'flex-end',
        padding: '.5rem',
        strokeWidth: 1.5,
        width: sizes.hugeIcon,
        height: sizes.hugeIcon,
        borderRadius: '25%',
        backgroundColor: colors.primaryBackground,
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
