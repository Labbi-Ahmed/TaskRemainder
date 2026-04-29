"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { User } from '../../types';
import Button from '../Common/Button';
import Input from '../Common/Input';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser({
      ...user,
      firstName,
      lastName,
      profilePicture
    });
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/settings"
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors group"
        >
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to System Settings
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
        <p className="mt-1 text-gray-600 italic">Manage your personal information and profile appearance.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {isEditing && (
                <button 
                  onClick={triggerFileInput}
                  className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-110 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="flex space-x-3 mb-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => {
                    setIsEditing(false);
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                    setProfilePicture(user.profilePicture || '');
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                  {isEditing ? (
                    <Input 
                      label="First Name" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      placeholder="First name"
                    />
                  ) : (
                    <p className="text-xl font-bold text-gray-900 ml-1">{user.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                  {isEditing ? (
                    <Input 
                      label="Last Name" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="Last name"
                    />
                  ) : (
                    <p className="text-xl font-bold text-gray-900 ml-1">{user.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <p className="text-gray-600 ml-1">{user.email}</p>
                <p className="text-[10px] text-gray-400 mt-1 italic ml-1">* Email cannot be changed</p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 h-fit">
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Account Information
              </h3>
              <ul className="space-y-3 text-sm text-indigo-800">
                <li className="flex justify-between">
                  <span className="opacity-70">Member Since</span>
                  <span className="font-bold">April 2026</span>
                </li>
                <li className="flex justify-between">
                  <span className="opacity-70">Account Type</span>
                  <span className="font-bold">Free Plan</span>
                </li>
                <li className="flex justify-between border-t border-indigo-100 pt-3">
                  <span className="opacity-70">Sync Status</span>
                  <span className="flex items-center text-green-600 font-bold">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Local Persistence
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
