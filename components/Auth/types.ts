import {
  Dispatch,
  SetStateAction
} from 'react';

export type AuthState = 'LOGIN' | 'REGISTER' | 'OTP' | 'SEND_OTP' | 'PASSWORD' | 'RESET';

export type BaseProps = {
  setAuthState: Dispatch<SetStateAction<AuthState>>,
};
