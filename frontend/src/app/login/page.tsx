"use client";
import React, { useEffect, useState } from 'react';
import LoginPage from '../../components/Auth/LoginPage';
import { useRouter } from 'next/navigation';
import { authUtils } from '../../utils/auth';

export default function Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (authUtils.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  if (!mounted || authUtils.isAuthenticated()) return null;
  
  return (
    <LoginPage 
      onToggle={() => router.push('/register')} 
      onLogin={() => router.push('/dashboard')} 
    />
  );
}
