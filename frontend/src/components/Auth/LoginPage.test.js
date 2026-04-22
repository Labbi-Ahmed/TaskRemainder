import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  test('renders login form with email/username and password fields', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email address or username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot your password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('shows error message on empty submission', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/please enter both email\/username and password\./i)).toBeInTheDocument();
  });

  test('allows typing in email/username and password fields', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address or username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows loading state on submission', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address or username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    expect(signInButton).toHaveAttribute('disabled');
    expect(screen.getByText(/sign in/i)).toBeInTheDocument(); // Button text should still be "Sign in"
    expect(screen.getByRole('button', { name: /sign in/i })).toContainHTML('<svg'); // Check for spinner
  });

  test('shows success message on successful login (simulated)', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address or username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    expect(await screen.findByText(/login successful! redirecting\.\.\./i, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(signInButton).not.toHaveAttribute('disabled');
  });
});
