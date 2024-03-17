import { Env } from '@/pages/api/env';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserClient } from '@supabase/ssr';
import { Session } from '@supabase/supabase-js';
import Footer from 'components/Footer/Footer';
import Navigation from 'components/Navigation/Navigation';
import type {
  AppContext,
  AppInitialProps,
  AppProps as NextAppProps,
} from 'next/app';
import NextApp from 'next/app';
import { useRouter } from 'next/router';
import {
  useEffect,
  useState,
} from 'react';
import {
  Slide,
  ToastContainer,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import 'styles/globals.css';
import { SWRConfig } from 'swr';
import Auth from '../components/Auth/Auth';
import SessionHandler from '../components/SessionHandler/SessionHandler';
import { useAliases } from '../hooks/aliases';
import useCalendars from '../hooks/calendars/useCalendars';
import { usePeople } from '../hooks/people';

type AppProps = {
  env: Env,
};

const hideFooterPaths = [
  '/calendar',
];

const slimHeaderPaths = [
  '/calendar',
  '/library/[docId]',
  '/library/create',
];

const localStorageProvider = () => {
  if (typeof window === 'undefined') {
    return new Map();
  }

  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map<string, any>(JSON.parse(window.localStorage.getItem('app-cache') || '[]'));

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener(
    'beforeunload',
    () => {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem(
        'app-cache',
        appCache,
      );
    },
  );

  // We still use the map for write & read for performance.
  return map;
};

export default function App({
  Component,
  pageProps,
  env,
}: NextAppProps<{ initialSession: Session }> & AppProps) {
  const [supabaseClient] = useState(() => createBrowserClient(
    env.supabaseUrl!,
    env.supabaseAnonKey!,
  ));
  const { pathname } = useRouter();
  useCalendars();
  usePeople();
  useAliases();

  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        window.cloudinaryCloudName = env.cloudinaryCloudName;
        window.cloudinaryApiKey = env.cloudinaryApiKey;
      }
    },
    [env.cloudinaryCloudName],
  );

  if (typeof window === 'undefined' || !window?.cloudinaryCloudName) {
    return;
  }

  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <RecoilRoot>
          <SessionHandler supabaseClient={supabaseClient} instanceName={env.instanceName}/>
          <Navigation slim={slimHeaderPaths.includes(pathname)}/>
          <ToastContainer
            transition={Slide}
            position="top-right"
            theme="dark"
          />
          <main>
            <Component {...pageProps} />
          </main>
          {!hideFooterPaths.includes(pathname) && <Footer/>}
          <Auth float={hideFooterPaths.includes(pathname)}/>
        </RecoilRoot>
      </SessionContextProvider>
    </SWRConfig>
  );
}

App.getInitialProps = async (context: AppContext): Promise<AppProps & AppInitialProps> => {
  const ctx = await NextApp.getInitialProps(context);
  let env;

  const response = await fetch(
    process.env.INSTANCE_NAME && process.env.NEXT_PUBLIC_ENVIRONMENT !== 'dev'
      ? `https://${process.env.INSTANCE_NAME}/api/env`
      : 'http://localhost:3000/api/env',
    { method: 'GET' },
  );

  env = await response.json();

  return {
    ...ctx,
    env,
  };
};
