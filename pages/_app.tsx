import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Session } from '@supabase/supabase-js';
import Footer from 'components/Footer/Footer';
import Navigation from 'components/Navigation/Navigation';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Slide,
  ToastContainer
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import 'styles/globals.css';
import { SWRConfig } from 'swr';
import Auth from '../components/Auth/Auth';
import SessionHandler from '../components/SessionHandler/SessionHandler';
import useCalendars from '../hooks/calendars/useCalendars';
import { usePeople } from '../hooks/people';

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
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem('app-cache', appCache);
  });

  // We still use the map for write & read for performance.
  return map;
};

export default function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const { pathname } = useRouter();
  useCalendars();
  usePeople();

  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <RecoilRoot>
          <SessionHandler supabaseClient={supabaseClient} />
          <Navigation slim={slimHeaderPaths.includes(pathname)} />
          <ToastContainer
            transition={Slide}
            position="top-right"
            theme="dark"
          />
          <main>
            <Component {...pageProps} />
          </main>
          {!hideFooterPaths.includes(pathname) && <Footer />}
          <Auth float={hideFooterPaths.includes(pathname)} />
        </RecoilRoot>
      </SessionContextProvider>
    </SWRConfig>
  );
}
