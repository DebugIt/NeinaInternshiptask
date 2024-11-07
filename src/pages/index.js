import Image from 'next/image'
import UserContext from '@/context/userContext'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import AuthForm from './AuthForm'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Set client-side flag
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
      router.push("/Homepage");
    }
  }, [router]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('isLoggedIn', isLoggedIn);
    }
  }, [isLoggedIn, isClient]);

  if (!isClient) return null; // Ensure SSR does not render this component

  return (
    <>
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <Head>
          <title>Neina Internship Task</title>
        </Head>
        <div id="container" className='flex h-screen justify-center items-center'>
          <AuthForm />
        </div>
      </UserContext.Provider>
    </>
  );
}
