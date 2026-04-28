"use client";
import React from 'react';
import { useTaskContext } from '../../../context/TaskContext';
import Settings from '../../../components/Dashboard/Settings';

export default function SettingsPage() {
  const { user, updateSettings } = useTaskContext();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Settings 
        user={user} 
        onUpdateSettings={updateSettings} 
      />
    </div>
  );
}
