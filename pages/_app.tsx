import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Session } from '@supabase/supabase-js';
import Footer from 'components/Footer/Footer';
import Navigation from 'components/Navigation/Navigation';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import 'styles/globals.css';

const fullHeightPaths = [
  '/calendar',
];

export default function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const { pathname } = useRouter();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <RecoilRoot>
        <Navigation slim={fullHeightPaths.includes(pathname)} />
        <ToastContainer
          position="top-center"
          theme="dark"
        />
        <main>
          <Component {...pageProps} />
        </main>
        {!fullHeightPaths.includes(pathname) && <Footer />}
      </RecoilRoot>
    </SessionContextProvider>
  );
}
