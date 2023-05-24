import { Button } from '@components';
import { useDictionary } from '@hooks/useDictionary';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, {
  useEffect,
  useState
} from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import Form from '../../Form/Form';
import Input from '../../Input/Input';

import { BaseProps } from '../types';

type FormValues = {
  name: string,
  family: string,
  password?: string,
  email?: string,
  emailRepeat?: string,
};

const LoginContent: React.FC<BaseProps> = ({ setAuthState }) => {
  const supabaseClient = useSupabaseClient();
  const [state, setState] = useState<'login' | 'register' | 'withPassword'>('login');
  const { getDictionaryValue } = useDictionary();

  const onSubmit: SubmitHandler<FormValues> = async ({
    name, family, password, email, emailRepeat
  }) => {
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
            })
          },
        )
          .then((response) => response.json());

        if (data.error) {
          throw new Error(data.error);
        }

        const signupData = await supabaseClient.auth.signUp({
          password,
          email,
          options: {
            data: {
              [process.env.NEXT_PUBLIC_INSTANCE_NAME ?? '']: {
                name: data.name.toLowerCase(),
                family: data.family.toLowerCase()
              },
            },
          },
        });

        if (signupData?.error) {
          toast.error(signupData.error.message);

          return;
        }

        if ((signupData.data.user?.identities?.length ?? 0) === 0) {
          toast.error(getDictionaryValue('auth', 'existsError'));

          return;
        }

        toast.success(getDictionaryValue('auth', 'registerSuccess'));
      } catch (error: any) {
        toast.error(error.message, { className: 'test' });
      }
    }
    try {
      const data = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          name,
          family,
          password,
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
    setAuthState(state === 'register' ? 'REGISTER' : 'LOGIN');
  }, [state]);

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Input
          required
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
        {state === 'register' && (
        <>
          <Input
            required
            name="password"
            placeholder={getDictionaryValue('auth', 'password')}
            aria-label={getDictionaryValue('auth', 'password')}
          />
          <Input
            required
            type="email"
            name="e-mail"
            placeholder={getDictionaryValue('auth', 'mail')}
            aria-label={getDictionaryValue('auth', 'mail')}
          />
          <Input
            required
            name="emailRepeat"
            placeholder={getDictionaryValue('auth', 'repeatMail')}
            aria-label={getDictionaryValue('auth', 'repeatMail')}
          />
          <Button
            type="submit"
            aria-label={getDictionaryValue('auth', 'createUser')}
          >
            {getDictionaryValue('auth', 'createUser')}
          </Button>
        </>
        )}
        {state === 'withPassword' && (
        <>
          <Input
            required
            name="password"
            placeholder={getDictionaryValue('auth', 'password')}
            aria-label={getDictionaryValue('auth', 'password')}
          />
          <Button
            type="submit"
            aria-label={getDictionaryValue('auth', 'login')}
          >
            {getDictionaryValue('auth', 'login')}
          </Button>
        </>
        )}
        {state === 'login' && (
        <>
          <Button
            type="button"
            onClick={() => setState('withPassword')}
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
            onClick={() => setState('register')}
            aria-label={getDictionaryValue('auth', 'createUser')}
          >
            {getDictionaryValue('auth', 'createUser')}
          </Button>
        </>
        )}
      </Form>
    </div>
  );
};

export default LoginContent;
