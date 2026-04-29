import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

describe('RegistrationForm', () => {
  test('renders registration form with all fields', () => {
    render(<RegistrationForm onToggle={jest.fn()} />);

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('updates input fields on change', () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('Password123!');
  });

  test('displays validation errors for empty fields on submit', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.click(signUpButton);

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('displays validation errors for invalid email format', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const emailInput = screen.getByLabelText(/email/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(signUpButton);

    expect(await screen.findByText(/email address is invalid/i)).toBeInTheDocument();
  });

  test('displays validation error for password shorter than 8 characters', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(signUpButton);

    expect(await screen.findByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
  });

  test('displays validation error when passwords do not match', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } });

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('submits the form successfully with valid data', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'validuser' } });
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123!' } });

    fireEvent.click(signUpButton);

    expect(signUpButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/registration successful! you can now log in./i)).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(signUpButton).not.toBeDisabled();
    expect(usernameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');
  });
});
