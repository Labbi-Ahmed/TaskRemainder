import React, { useState } from 'react';
import RegistrationForm from './components/Auth/RegistrationForm';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

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
        <nav className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
          <div className="text-xl font-bold text-indigo-600">TaskRemainder</div>
          <button 
            onClick={() => setCurrentPage('login')}
            className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition duration-150"
          >
            Logout
          </button>
        </nav>
      )}
      {renderPage()}
    </div>
  );
}

export default App;

