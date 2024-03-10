import { sessionAtom } from '@/atoms/session';
import {
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import * as process from 'process';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  SetterOrUpdater,
  useSetRecoilState,
} from 'recoil';

type SessionHandlerProps = { supabaseClient: SupabaseClient };

const passwordRecovery = async ({
  supabaseClient,
  accessToken,
  refreshToken,
  setSession,
}: {
  supabaseClient: SupabaseClient,
  accessToken: string,
  refreshToken: string,
  setSession: SetterOrUpdater<Session | null>,
}) => {
  const response = await supabaseClient.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  setSession(response.data.session);

  window.history.replaceState(
    null,
    '',
    ' ',
  );

  const newPassword = prompt('Skriv in ett nytt lösenord');

  if (!newPassword) {
    return;
  }

  const {
    data,
    error,
  } = await supabaseClient.auth.updateUser({ password: newPassword });

  if (error) {
    toast.error('Något gick fel. Lösenordet kunde inte uppdateras');

    return;
  }

  if (data) {
    toast.success('Ditt lösenord har uppdaterats!');
  }
};

const SessionHandler: React.FC<SessionHandlerProps> = ({ supabaseClient }) => {
  const setSession = useSetRecoilState(sessionAtom);
  const router = useRouter();

  useEffect(
    () => {
      supabaseClient.auth.getSession()
        .then(({ data }) => {
          const userData = data.session?.user.user_metadata[process.env.NEXT_PUBLIC_INSTANCE_NAME ?? ''];

          if (!data.session) {
            return null;
          }

          setSession(data.session);
          toast.info(
            `Välkommen, ${userData?.identities?.[0].name} ${userData?.identities?.[0].family}`,
            {
              style: {
                textTransform: 'capitalize',
              },
              autoClose: 1000,
              toastId: data.session?.user.id,
              pauseOnFocusLoss: false,
              pauseOnHover: false,
              closeButton: false,
              hideProgressBar: true,
            },
          );

          return true;
        });

      const {
        data: { subscription },
      } = supabaseClient
        .auth
        .onAuthStateChange(async (
          event,
          newSession,
        ) => {
          if (event === 'SIGNED_OUT') {
            setSession(null);
            toast.success('Ni har loggat ut!');
            router.push('/');

            return;
          }

          if (newSession) {
            setSession(newSession);
          }
        });

      if (window?.location.hash.includes('access_token')) {
        const accessToken = window.location.hash.match(/access_token=[\w\d.-]+/)?.[0]?.split('=')?.[1];
        const refreshToken = window.location.hash.match(/refresh_token=[\w\d.-]+/)?.[0]?.split('=')?.[1];

        if (accessToken && refreshToken) {
          passwordRecovery({
            supabaseClient,
            accessToken,
            refreshToken,
            setSession,
          });
        }
      }

      return () => subscription.unsubscribe();
    },
    [],
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export default React.memo(SessionHandler);
