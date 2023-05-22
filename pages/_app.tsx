import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Session } from '@supabase/supabase-js';
import Footer from 'components/Footer/Footer';
import Navigation from 'components/Navigation/Navigation';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import 'styles/globals.css';

export default function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <RecoilRoot>
        <Navigation />
        <ToastContainer
          position="top-center"
          theme="dark"
        />
        <Component {...pageProps} />
        <Footer />
      </RecoilRoot>
    </SessionContextProvider>
  );
}
