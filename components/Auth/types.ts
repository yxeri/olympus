import {
  Dispatch,
  SetStateAction
} from 'react';

export type AuthState = 'LOGIN' | 'REGISTER' | 'OTP';

export type BaseProps = {
  setAuthState: Dispatch<SetStateAction<AuthState>>,
};
