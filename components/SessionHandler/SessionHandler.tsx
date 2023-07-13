import { SupabaseClient } from '@supabase/supabase-js';
import * as process from 'process';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { sessionAtom } from '../../atoms/session';

type SessionHandlerProps = { supabaseClient: SupabaseClient };

const SessionHandler: React.FC<SessionHandlerProps> = ({ supabaseClient }) => {
  const setSession = useSetRecoilState(sessionAtom);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      const userData = data.session?.user.user_metadata[process.env.NEXT_PUBLIC_INSTANCE_NAME ?? ''];

      setSession(data.session);
      toast.info(`Welcome, ${userData}`, {
        autoClose: 1000,
        toastId: data.session?.user.id,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        closeButton: false,
        hideProgressBar: true,
      });
    });

    const {
      data: { subscription },
    } = supabaseClient
      .auth
      .onAuthStateChange((_, newSession) => setSession(newSession));

    return () => subscription.unsubscribe();
  }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export default React.memo(SessionHandler);
