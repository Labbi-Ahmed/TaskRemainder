import React, { useState } from 'react';
import RegistrationForm from './components/Auth/RegistrationForm';
import LoginPage from './components/Auth/LoginPage';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="App">
      {isLogin ? (
        <LoginPage onToggle={toggleForm} />
      ) : (
        <RegistrationForm onToggle={toggleForm} />
      )}
    </div>
);
}

export default App;
