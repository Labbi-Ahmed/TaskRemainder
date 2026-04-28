"use client";
import React from 'react';
import RegistrationForm from '../../components/Auth/RegistrationForm';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  return (
    <RegistrationForm 
      onToggle={() => router.push('/login')} 
    />
  );
}
