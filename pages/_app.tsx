import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/Footer/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </RecoilRoot>
  );
}
