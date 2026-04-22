import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from './RegistrationForm';

describe('RegistrationForm', () => {
  test('renders registration form with all fields', () => {
    render(<RegistrationForm onToggle={jest.fn()} />);

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('updates input fields on change', () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('Password123!');
  });

  test('displays validation errors for empty fields on submit', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const registerButton = screen.getByRole('button', { name: /register/i });

    fireEvent.click(registerButton);

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('displays validation errors for invalid email format', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const emailInput = screen.getByLabelText(/email/i);
    const registerButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(registerButton);

    expect(await screen.findByText(/email address is invalid/i)).toBeInTheDocument();
  });

  test('displays validation errors for weak password', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(passwordInput, { target: { value: 'short' } }); // Too short
    fireEvent.click(registerButton);
    expect(await screen.findByText(/password must be at least 8 characters long/i)).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'password' } }); // No uppercase, number, special
    fireEvent.click(registerButton);
    expect(await screen.findByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
  });

  test('submits the form successfully with valid data', async () => {
    render(<RegistrationForm onToggle={jest.fn()} />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: 'validuser' } });
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });

    fireEvent.click(registerButton);

    expect(registerButton).toBeDisabled(); // Button should be disabled during submission
    expect(await screen.findByText(/registering.../i)).toBeInTheDocument(); // Loading message

    await waitFor(() => {
      expect(screen.getByText(/registration successful! you can now log in./i)).toBeInTheDocument();
    }, { timeout: 2000 }); // Wait for the simulated API call to complete

    expect(registerButton).not.toBeDisabled(); // Button should be re-enabled
    expect(usernameInput).toHaveValue(''); // Form fields should be cleared
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });
});
