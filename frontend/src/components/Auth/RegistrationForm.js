import React, { useState } from 'react';

const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const validateForm = () => {
    let isValid = true;

    // Clear previous errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    // Username validation
    if (!username) {
      setUsernameError('Username is required.');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long.');
      isValid = false;
    }

    // Email validation
    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email address is invalid.');
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter.');
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter.');
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number.');
      isValid = false;
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError('Password must contain at least one special character (!@#$%^&*).');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage(''); // Clear previous submission messages

    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 second delay

        // Simulate success
        setSubmissionMessage('Registration successful! You can now log in.');
        // Optionally clear form fields on success
        setUsername('');
        setEmail('');
        setPassword('');

      } catch (error) {
        // Simulate error
        setSubmissionMessage('Registration failed. Please try again.');
        console.error('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-5">Register</h2>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {usernameError && <p className="text-red-500 text-xs italic mt-1">{usernameError}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {emailError && <p className="text-red-500 text-xs italic mt-1">{emailError}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
        {passwordError && <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>}
      </div>
      <button type="submit" disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed">
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      {submissionMessage && (
        <p className={`mt-4 text-center text-sm ${submissionMessage.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
          {submissionMessage}
        </p>
      )}
    </form>
  );
};

export default RegistrationForm;
