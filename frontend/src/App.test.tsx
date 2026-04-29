import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login page by default', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /taskreminder/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email address or username/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});
