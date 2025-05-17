'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpAPI } from '../../../apis/auth';

export default function SignupPage() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      setError('All fields are required');
      return;
    }

    setError('');

    signUpAPI({ name, email, password, role })
      .then(() => {
        router.push('/auth/login');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4 text-black">Sign Up</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <label className="block text-sm text-black mb-1">Full Name</label>
        <input
          className="w-full mb-3 p-2 border"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm text-black mb-1">Email</label>
        <input
          className="w-full mb-3 p-2 border"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm text-black mb-1">Password</label>
        <input
          className="w-full mb-3 p-2 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="Role" className="block text-sm text-black mb-1">Role</label>
        <select
          id="Role"
          className="w-full mb-4 p-2 border text-black"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        <button
          className="w-full bg-black text-white py-2 rounded cursor-pointer"
          type="submit"
        >
          Sign Up
        </button>

        <div className="mt-4 text-center">
          <a href="/auth/login" className="text-black underline">
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}
