"use client";
import React, { useState, useEffect } from 'react';
import AuthLayout from './AuthLayout';
import Input from '../Common/Input';
import Button from '../Common/Button';

interface RegistrationFormProps {
  onToggle: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onToggle }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Real-time Password Validation
  useEffect(() => {
    if (password && password.length >= 8) {
      setPasswordError('');
    }
  }, [password]);

  // Real-time Password Matching Validation
  useEffect(() => {
    if (confirmPassword) {
      if (password === confirmPassword) {
        setConfirmPasswordError('');
        setPasswordsMatch(true);
      } else {
        setConfirmPasswordError('Passwords do not match.');
        setPasswordsMatch(false);
      }
    } else {
      setConfirmPasswordError('');
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  const validateForm = () => {
    let isValid = true;

    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!username) {
      setUsernameError('Username is required.');
      isValid = false;
    }

    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email address is invalid.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionMessage('');

    if (validateForm()) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmissionMessage('Registration successful! You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        setSubmissionMessage('Registration failed. Please try again.');
        console.error('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const regIcon = (
    <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join TaskRemainder today"
      icon={regIcon}
    >
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {submissionMessage && (
          <p className={`text-center text-sm font-medium ${submissionMessage.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
            {submissionMessage}
          </p>
        )}

        <div className="rounded-md shadow-sm space-y-4">
          <Input
            label="Username"
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            disabled={isLoading}
          />
          <Input
            label="Email address"
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            disabled={isLoading}
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          />
          <Input
            label="Confirm Password"
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPasswordError || (passwordsMatch ? 'Passwords match' : undefined)}
            className={passwordsMatch ? 'border-green-500' : ''}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading || !password}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading}>
            Sign up
          </Button>
        </div>
      </form>

      <div className="text-center text-sm mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Button variant="link" type="button" fullWidth={false} onClick={onToggle}>
            Sign in
          </Button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegistrationForm;
