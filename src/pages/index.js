import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserContext from '@/context/userContext';
import AuthForm from './AuthForm';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); 
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

  if (!isClient) return null; 

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div id="container" className='flex h-screen justify-center items-center'>
        <AuthForm />
      </div>
    </UserContext.Provider>
  );
}
