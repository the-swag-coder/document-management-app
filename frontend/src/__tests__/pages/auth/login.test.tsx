import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../../app/auth/login/page';
import { useRouter } from 'next/navigation';
import { login } from '@/utils/auth';
import { loginAPI } from '../../../apis/auth';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/auth', () => ({
  login: jest.fn(),
}));

jest.mock('../../../apis/auth', () => ({
  loginAPI: jest.fn(),
}));

describe('LoginPage Component', () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    userEvent.click(loginButton);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('shows an error if email or password is empty', async () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    userEvent.click(loginButton);
    expect(await screen.findByText('Email and password required')).toBeInTheDocument();
  });

  it('calls loginAPI and navigates on successful login', async () => {
    const mockToken = { token: 'fake-token', role: 'user' };
    (loginAPI as jest.Mock).mockResolvedValue(mockToken);

    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    const loginButton = screen.getByRole('button', { name: /login/i });
    userEvent.click(loginButton);

    await waitFor(() => {
      expect(loginAPI).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(login).toHaveBeenCalledWith(mockToken);
    expect(push).toHaveBeenCalledWith('/dashboard');
  });

  it('does not call loginAPI if email and password are empty', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');

    const loginButton = screen.getByRole('button', { name: /login/i });

    await userEvent.click(loginButton);

    await screen.findByText('Email and password required');

    expect(loginAPI).not.toHaveBeenCalled();
  });
});
