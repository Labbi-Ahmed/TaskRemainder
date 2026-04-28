"use client";
import React from 'react';
import { useTaskContext } from '../../../../context/TaskContext';
import Profile from '../../../../components/Dashboard/Profile';

export default function ProfilePage() {
  const { user, setUser } = useTaskContext();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Profile 
        user={user} 
        onUpdateUser={setUser} 
      />
    </div>
  );
}
