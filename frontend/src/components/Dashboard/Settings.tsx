"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { User, NotificationSettings } from '../../types';
import Button from '../Common/Button';
import Select from '../Common/Select';
import { requestForToken } from '../../utils/firebase';

interface SettingsProps {
  user: User;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateSettings }) => {
  const [settings, setSettings] = useState<NotificationSettings>(user.settings || {
    pushEnabled: false,
    emailEnabled: true,
    inAppEnabled: true,
    soundEnabled: true,
    dailyDigest: false,
    leadTimeMinutes: 15,
  });

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const [isRegistering, setIsRegistering] = useState(false);
  const [pushError, setPushError] = useState('');

  const handleToggle = async (key: keyof NotificationSettings) => {
    if (key === 'pushEnabled' && !settings.pushEnabled) {
      // Enabling push, need to get token
      setIsRegistering(true);
      const token = await requestForToken();
      setIsRegistering(false);
      
      if (token) {
        setPushError('');
        const newSettings = { ...settings, [key]: true };
        setSettings(newSettings);
        onUpdateSettings(newSettings);
      } else {
        setPushError('Could not enable push notifications. Please check browser permissions.');
      }
      return;
    }

    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const handleSelectChange = (key: keyof NotificationSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return;
    
    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    
    if (permission === 'granted') {
      await handleToggle('pushEnabled');
    }
  };

  const leadTimeOptions = [
    { value: '0', label: 'At time of event' },
    { value: '5', label: '5 minutes before' },
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">System Settings</h1>
        <p className="mt-1 text-gray-600 italic">Configure how the Smart Reminder system interacts with you.</p>
      </header>

      <div className="space-y-8">
        {/* Profile Navigation Card */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Personal Information</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-16 h-16 rounded-full bg-indigo-100 border-2 border-indigo-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-indigo-600 uppercase">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-500 font-medium truncate">{user.email}</p>
              </div>
            </div>
            <Link 
              href="/settings/profile"
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95 text-center"
            >
              Edit Profile
            </Link>
          </div>
        </section>

        {/* Notification Health Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0">
                <div className={`flex-shrink-0 p-3 rounded-xl ${permissionStatus === 'granted' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">Push Notification Status</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 sm:line-clamp-none">
                        {permissionStatus === 'granted' ? 'System is authorized to send alerts.' : 'Permission is required for browser alerts.'}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {pushError && (
                <p className="text-xs text-red-600 font-medium text-right max-w-xs">{pushError}</p>
              )}
              {permissionStatus !== 'granted' && (
                <Button
                  onClick={requestNotificationPermission}
                  fullWidth={false}
                  className="px-4 py-1.5 text-xs whitespace-nowrap"
                >
                  Enable Alerts
                </Button>
              )}
            </div>
        </div>

        {/* Primary Notification Channels */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Delivery Channels</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-800">Browser Push Notifications</h4>
                <p className="text-sm text-gray-500">Receive real-time alerts even when the app is in the background.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.pushEnabled} onChange={() => handleToggle('pushEnabled')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-800">In-App Notifications</h4>
                <p className="text-sm text-gray-500">Show notification toasts while using the application.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.inAppEnabled} onChange={() => handleToggle('inAppEnabled')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-800">Email Reminders</h4>
                <p className="text-sm text-gray-500">Send backup reminders to your registered email address.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.emailEnabled} onChange={() => handleToggle('emailEnabled')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Intelligence & Timing */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Scheduling Intelligence</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Advance Reminder (Lead Time)</label>
                    <Select 
                        label="Lead Time"
                        options={leadTimeOptions}
                        value={settings.leadTimeMinutes.toString()}
                        onChange={(e) => handleSelectChange('leadTimeMinutes', Number(e.target.value))}
                    />
                    <p className="mt-2 text-xs text-gray-400">How many minutes before the scheduled time should we alert you?</p>
                </div>

                <div className="flex items-center justify-between border-l border-gray-50 pl-8">
                  <div>
                    <h4 className="font-bold text-gray-800">Sound Effects</h4>
                    <p className="text-xs text-gray-500">Play a subtle alert sound for notifications.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.soundEnabled} onChange={() => handleToggle('soundEnabled')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
            </div>

            <div className="border-t border-gray-50 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="font-bold text-gray-800">Daily Digest</h4>
                        <p className="text-sm text-gray-500">Receive a morning summary of all tasks due for the day.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.dailyDigest} onChange={() => handleToggle('dailyDigest')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
            </div>
          </div>
        </section>

        {/* Advanced Architecture Warning */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start space-x-3">
            <svg className="w-5 h-5 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-indigo-700 leading-relaxed">
                <strong>Architect's Note:</strong> Real-time push notifications require a service worker and a backend VAPID key exchange. This UI is ready for backend integration via the `pushEnabled` flag.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
