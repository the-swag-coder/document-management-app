import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '../../../app/auth/signup/page';
import { useRouter } from 'next/navigation';
import { signUpAPI } from '../../../apis/auth';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../apis/auth', () => ({
  signUpAPI: jest.fn(),
}));

describe('SignupPage Component', () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SignupPage />);
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows an error if any field is empty', async () => {
    render(<SignupPage />);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await userEvent.click(signUpButton);
    expect(await screen.findByText('All fields are required')).toBeInTheDocument();
    expect(signUpAPI).not.toHaveBeenCalled();
  });

  it('calls signUpAPI and navigates to login page on success', async () => {
    (signUpAPI as jest.Mock).mockResolvedValueOnce({});

    render(<SignupPage />);

    await userEvent.type(screen.getByPlaceholderText('Full Name'), 'John Doe');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.selectOptions(screen.getByLabelText('Role'), 'admin');

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await userEvent.click(signUpButton);

    await waitFor(() => {
      expect(signUpAPI).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'admin',
      });
    });

    expect(push).toHaveBeenCalledWith('/auth/login');
  });

  it('does not call signUpAPI if any input is missing', async () => {
    render(<SignupPage />);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    await userEvent.type(screen.getByPlaceholderText('Email'), 'onlyemail@example.com');
    await userEvent.click(signUpButton);

    await screen.findByText('All fields are required');
    expect(signUpAPI).not.toHaveBeenCalled();
  });
});
