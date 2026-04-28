"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../types';
import { authUtils } from '../../utils/auth';

interface UserBadgeProps {
  user: User;
  onLogout?: () => void;
  onNavigate?: (view: string) => void;
}

const UserBadge: React.FC<UserBadgeProps> = ({ user, onLogout, onNavigate }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const userName = `${user.firstName} ${user.lastName}`;
  const userEmail = user.email;
  const initials = `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    authUtils.logout();
    if (onLogout) onLogout();
    router.push('/login');
  };

  const handleNavigate = (view: string) => {
    setIsProfileOpen(false);
    if (onNavigate) {
      onNavigate(view);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-3 focus:outline-none p-1 rounded-full hover:bg-slate-100 transition duration-150"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm border-2 border-white overflow-hidden">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-bold text-slate-700 leading-none">{userName}</p>
        </div>
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-slate-100 transform origin-top-right transition-all duration-200">
          <div className="px-4 py-3 border-b border-slate-50">
            <p className="text-sm font-bold text-slate-700">{userName}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
          
          <div className="py-1">
            <button 
              onClick={() => handleNavigate('dashboard')}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-150"
            >
              <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Dashboard
            </button>
            <button 
              onClick={() => handleNavigate('profile')}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-150"
            >
              <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </button>
          </div>
          
          <div className="border-t border-slate-100 my-1"></div>
          
          <div className="py-1">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150"
            >
              <svg className="w-4 h-4 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBadge;
