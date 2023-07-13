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
import Auth from '../components/Auth/Auth';
import SessionHandler from '../components/SessionHandler/SessionHandler';

const fullHeightPaths = [
  '/calendar',
  '/library',
];

export default function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const { pathname } = useRouter();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <RecoilRoot>
        <SessionHandler supabaseClient={supabaseClient} />
        <Navigation slim={fullHeightPaths.includes(pathname)} />
        <ToastContainer
          transition={Slide}
          position="top-right"
          theme="dark"
        />
        <main>
          <Component {...pageProps} />
        </main>
        {!fullHeightPaths.includes(pathname) && <Footer />}
        <Auth />
      </RecoilRoot>
    </SessionContextProvider>
  );
}
