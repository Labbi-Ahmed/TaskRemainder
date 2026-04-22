import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Input from '../Common/Input';
import Button from '../Common/Button';

interface LoginPageProps {
  onToggle: () => void;
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onToggle, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email/username and password.');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email, password });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        if (onLogin) onLogin();
      }, 500);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loginIcon = (
    <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <AuthLayout
      title="TaskRemainder"
      subtitle="Sign in to your account"
      icon={loginIcon}
    >
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center font-medium">{success}</p>}

        <div className="rounded-md shadow-sm space-y-4">
          <Input
            label="Email address or Username"
            id="email-address"
            name="email"
            type="text"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Button variant="link" type="button" fullWidth={false}>
              Forgot your password?
            </Button>
          </div>
        </div>

        <div>
          <Button type="submit" isLoading={loading}>
            Sign in
          </Button>
        </div>
      </form>

      <div className="text-center text-sm mt-6">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Button variant="link" type="button" fullWidth={false} onClick={onToggle}>
            Sign up
          </Button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
