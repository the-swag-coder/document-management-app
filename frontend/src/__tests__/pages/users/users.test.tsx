import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UsersPage from '../../../app/users/page';
import {
  getUsersAPI,
  createUserAPI,
  getUserByIdAPI,
  updateUserAPI,
} from '../../../apis/users';

jest.mock('../../../apis/users', () => ({
  getUsersAPI: jest.fn(),
  createUserAPI: jest.fn(),
  getUserByIdAPI: jest.fn(),
  updateUserAPI: jest.fn(),
}));

const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'editor' },
];

describe('UsersPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays users on mount', async () => {
    (getUsersAPI as jest.Mock).mockResolvedValue(mockUsers);

    render(<UsersPage />);

    await waitFor(() => {
      expect(getUsersAPI).toHaveBeenCalled();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });
  });

  it('opens modal to create a user', async () => {
    render(<UsersPage />);

    const createButton = screen.getByRole('button', { name: /^create user$/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    });
  });

  it('submits new user and updates list', async () => {
    (getUsersAPI as jest.Mock).mockResolvedValue([]);
    const newUser = {
      id: 3,
      name: 'Charlie',
      email: 'charlie@example.com',
      role: 'viewer',
    };
    (createUserAPI as jest.Mock).mockResolvedValue(newUser);

    render(<UsersPage />);
    fireEvent.click(screen.getByText('Create User'));

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Charlie' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'charlie@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByDisplayValue('Select Role'), {
      target: { value: 'viewer' },
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(createUserAPI).toHaveBeenCalledWith({
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'password123',
        role: 'viewer',
      });
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });
  });

  it('opens modal to edit a user and populates fields', async () => {
    (getUsersAPI as jest.Mock).mockResolvedValue(mockUsers);
    (getUserByIdAPI as jest.Mock).mockResolvedValue(mockUsers[0]);

    render(<UsersPage />);

    await waitFor(() => screen.getByText('Alice'));

    fireEvent.click(screen.getByText('Alice'));

    await waitFor(() => {
      expect(getUserByIdAPI).toHaveBeenCalledWith(1);
      expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    });
  });

  it('updates user on edit and closes modal', async () => {
    const updatedUser = {
      id: 1,
      name: 'Alice Updated',
      email: 'alice@example.com',
      role: 'admin',
    };
    (getUsersAPI as jest.Mock).mockResolvedValue(mockUsers);
    (getUserByIdAPI as jest.Mock).mockResolvedValue(mockUsers[0]);
    (updateUserAPI as jest.Mock).mockResolvedValue(updatedUser);

    render(<UsersPage />);
    await waitFor(() => screen.getByText('Alice'));

    fireEvent.click(screen.getByText('Alice'));

    await waitFor(() => screen.getByDisplayValue('Alice'));
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Alice Updated' },
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(updateUserAPI).toHaveBeenCalledWith(1, {
        name: 'Alice Updated',
        email: 'alice@example.com',
        password: '',
        role: 'admin',
      });
      expect(screen.getByText('Alice Updated')).toBeInTheDocument();
    });
  });

  it('closes modal on cancel', async () => {
    (getUsersAPI as jest.Mock).mockResolvedValue([]);

    render(<UsersPage />);
    fireEvent.click(screen.getByText('Create User'));

    await waitFor(() => screen.getByText('Cancel'));

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });
  });

  it('does not submit incomplete form', async () => {
    (getUsersAPI as jest.Mock).mockResolvedValue([]);

    render(<UsersPage />);
    fireEvent.click(screen.getByText('Create User'));

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(createUserAPI).not.toHaveBeenCalled();
    });
  });

  it('handles API fetch errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    (getUsersAPI as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    render(<UsersPage />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to fetch users', expect.any(Error));
    });

    consoleError.mockRestore();
  });
});
