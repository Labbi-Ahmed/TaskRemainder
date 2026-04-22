import React, { useState, useEffect, useRef } from 'react';
import RegistrationForm from './components/Auth/RegistrationForm';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <LoginPage onToggle={() => setCurrentPage('register')} onLogin={() => setCurrentPage('dashboard')} />;
      case 'register':
        return <RegistrationForm onToggle={() => setCurrentPage('login')} />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <LoginPage onToggle={() => setCurrentPage('register')} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {currentPage === 'dashboard' && (
        <nav className="bg-white shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-50">
          <div className="text-xl font-bold text-indigo-600">TaskRemainder</div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 focus:outline-none p-1 rounded-full hover:bg-gray-50 transition duration-150"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white">
                LA
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-700 leading-none">Labbi Ahmed</p>
                <p className="text-[10px] text-gray-500 mt-1">Pro Member</p>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 transform origin-top-right transition-all duration-200">
                <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                  <p className="text-sm font-bold text-gray-700">Labbi Ahmed</p>
                  <p className="text-xs text-gray-500">labbi@example.com</p>
                </div>
                
                <div className="py-1">
                  <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-150">
                    <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>
                  <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-150">
                    <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <div className="py-1">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      setCurrentPage('login');
                    }}
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
        </nav>
      )}
      {renderPage()}
    </div>
  );
}

export default App;

