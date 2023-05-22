import { Modal } from '@components';
import React, { useState } from 'react';
import { Trigger } from '../Modal/Modal';
import LoginContent from './content/LoginContent';
import { AuthState } from './types';

const Auth = () => {
  const [authState, setAuthState] = useState<AuthState>('LOGIN');

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
      trigger={<Trigger>Trigger</Trigger>}
      title={title}
      content={<LoginContent setAuthState={setAuthState} />}
    />
  );
};

export default Auth;
