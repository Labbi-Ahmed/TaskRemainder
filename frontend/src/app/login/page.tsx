"use client";
import React from 'react';
import LoginPage from '../../components/Auth/LoginPage';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  return (
    <LoginPage 
      onToggle={() => router.push('/register')} 
      onLogin={() => router.push('/dashboard')} 
    />
  );
}
