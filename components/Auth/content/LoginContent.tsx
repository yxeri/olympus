import { useSupabaseClient } from '@supabase/auth-helpers-react';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import {
  SubmitHandler,
  useFormContext,
} from 'react-hook-form';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useDictionary } from '../../../hooks/useDictionary';
import { sizes } from '../../../styles/global';
import Button from '../../Button/Button';
import Form from '../../Form/Form';
import Input from '../../Input/Input';

import {
  AuthState,
  BaseProps
} from '../types';

type FormValues = {
  name: string,
  family: string,
  password?: string,
  email?: string,
  emailRepeat?: string,
  type?: AuthState,
};

const StyledBack = styled(Button)`
  position: absolute;
  top: .7rem;
  left: .5rem;
  display: grid;
  align-items: center;
  border: none;
  background: unset;
  cursor: pointer;
  padding: 0;
`;

const ButtonContainer = styled.div`
  display: grid;
  margin-top: .5rem;
  padding-top: 1rem;
  border-top: 1px solid;
  grid-gap: inherit;

`;

const ResetButton = ({ onSubmit }: { onSubmit: SubmitHandler<FormValues> }) => {
  const formMethods = useFormContext<FormValues>();

  return (
    <Button
      type="button"
      onClick={async () => {
        const { name, family } = formMethods.getValues();
        if (name && family) {
          formMethods.register('type', { value: 'RESET' });
          formMethods.handleSubmit(onSubmit)();
        }
      }}
      aria-label="Reset password"
    >
      Återställ lösenord
    </Button>
  );
};

const LoginContent: React.FC<BaseProps> = ({ setAuthState }) => {
  const supabaseClient = useSupabaseClient();
  const [state, setState] = useState<AuthState>('LOGIN');
  const { getDictionaryValue } = useDictionary();
  const firstInput = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async ({
    type,
    name,
    family,
    password,
    email,
    emailRepeat,
  }) => {
    if (type === 'RESET') {
      try {
        const data = await fetch(
          '/api/auth/reset',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              family,
            })
          },
        );

        if (data.status === 404) {
          throw new Error(getDictionaryValue('auth', 'doesNotExistError'));
        }

        if (data.status === 403) {
          throw new Error('Något gick fel');
        }

        if (!data.ok) {
          throw new Error((await data.json()).error);
        }

        toast.success('Ni kommer snart få ett mail med en länk för återställning av lösenordet');

        return;
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);

        return;
      }
    }

    if (email && emailRepeat && password) {
      try {
        const data = await fetch(
          '/api/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              name,
              family,
              password,
            })
          },
        );

        if (data.status === 404) {
          throw new Error(getDictionaryValue('auth', 'doesNotExistError'));
        }

        if (data.status === 403) {
          throw new Error(getDictionaryValue('auth', 'existsError'));
        }

        if (!data.ok) {
          throw new Error((await data.json()).error);
        }

        toast.success(getDictionaryValue('auth', 'registerSuccess'));

        return;
      } catch (error: any) {
        console.log(error);
        toast.error(error.message, { className: 'test' });

        return;
      }
    }

    if (!password) {
      console.log('otp');
      try {
        const data = await fetch('/api/auth/otp', {
          method: 'POST',
          body: JSON.stringify({
            name,
            family,
          }),
        }).then((response) => response.json());

        if (data.error) {
          throw new Error('Failed otp');
        }

        setState('OTP');
        toast.success('Kod har skickats till din adress');

        return;
      } catch (error: any) {
        toast.error(error.message);

        return;
      }
    }

    try {
      const data = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          name,
          family,
          password,
          type: state,
        }),
      }).then((response) => response.json());

      if (data.error) {
        throw new Error('Failed login');
      }

      await supabaseClient.auth.setSession(data.session);

      toast.success(`${getDictionaryValue('auth', 'welcome')}, ${name} ${family}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setAuthState(state === 'REGISTER' ? 'REGISTER' : 'LOGIN');

    if (state === 'LOGIN' && firstInput.current) {
      firstInput.current.focus();
    }

    if ((state === 'REGISTER' || state === 'OTP' || state === 'PASSWORD') && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [state, firstInput.current, passwordRef.current]);

  return (
    <>
      {state !== 'LOGIN' && (
        <StyledBack onClick={() => setState('LOGIN')}>
          <ArrowLeftIcon width={sizes.largeIcon} height={sizes.largeIcon} />
        </StyledBack>
      )}
      <div>
        <Form onSubmit={onSubmit} keepData={state === 'OTP'}>
          <Input
            required
            ref={firstInput}
            name="name"
            placeholder={getDictionaryValue('common', 'name')}
            aria-label={getDictionaryValue('common', 'name')}
          />
          <Input
            required
            name="family"
            placeholder={getDictionaryValue('common', 'family')}
            aria-label={getDictionaryValue('common', 'family')}
          />
          {(state === 'REGISTER' || state === 'OTP' || state === 'PASSWORD') && (
            <Input
              required
              type="password"
              ref={passwordRef}
              name="password"
              placeholder={getDictionaryValue('auth', 'password')}
              aria-label={getDictionaryValue('auth', 'password')}
            />
          )}
          {state === 'REGISTER' && (
            <>
              <Input
                required
                type="email"
                name="email"
                placeholder={getDictionaryValue('auth', 'mail')}
                aria-label={getDictionaryValue('auth', 'mail')}
              />
              <Input
                required
                name="emailRepeat"
                placeholder={getDictionaryValue('auth', 'repeatMail')}
                aria-label={getDictionaryValue('auth', 'repeatMail')}
              />
              <ButtonContainer>
                <Button
                  type="submit"
                  aria-label={getDictionaryValue('auth', 'createUser')}
                >
                  {getDictionaryValue('auth', 'createUser')}
                </Button>
              </ButtonContainer>
            </>
          )}
          {(state === 'OTP' || state === 'PASSWORD') && (
            <ButtonContainer>
              <Button
                type="submit"
                aria-label={getDictionaryValue('auth', 'login')}
              >
                {state === 'OTP' ? 'OTP' : getDictionaryValue('auth', 'login')}
              </Button>
            </ButtonContainer>
          )}
          {state === 'LOGIN' && (
            <ButtonContainer>
              <Button
                type="button"
                onClick={() => setState('PASSWORD')}
                aria-label={getDictionaryValue('auth', 'login')}
              >
                {getDictionaryValue('auth', 'login')}
              </Button>
              <Button
                type="submit"
              >
                {getDictionaryValue('auth', 'otp')}
              </Button>
              <Button
                type="button"
                onClick={() => setState('REGISTER')}
                aria-label={getDictionaryValue('auth', 'createUser')}
              >
                {getDictionaryValue('auth', 'createUser')}
              </Button>
              <ResetButton onSubmit={onSubmit} />
            </ButtonContainer>
          )}
        </Form>
      </div>
    </>
  );
};

export default LoginContent;
