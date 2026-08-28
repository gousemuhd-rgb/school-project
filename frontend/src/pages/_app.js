import '@/styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';
import Head from 'next/head';

// Pages that don't require auth
const publicPages = ['/', '/login', '/register'];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const isPublic = publicPages.includes(router.pathname);
    if (!isAuthenticated && !isPublic) {
      router.replace('/login');
    }
    if (isAuthenticated && (router.pathname === '/login' || router.pathname === '/register')) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router.pathname]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#f1f5f9', fontFamily: 'Arial, sans-serif' }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
