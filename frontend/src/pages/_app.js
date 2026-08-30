import '../styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>CampusResolve — College Complaint Management System</title>
        <meta
          name="description"
          content="Streamlined and transparent complaint reporting and tracking system for students and college administration."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
