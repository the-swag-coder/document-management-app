'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/utils/auth';
import { loginAPI } from '../../../apis/auth';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setError('');

    loginAPI({ email, password })
      .then((res: {token: string, role: string}) => {
        login(res);
        router.push('/dashboard');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-black">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <label className="block text-sm text-black mb-1">Email</label>
        <input
          className="w-full mb-2 p-2 border"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="block text-sm text-black mb-1">Password</label>
        <input
          className="w-full mb-4 p-2 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-black text-white py-2 rounded cursor-pointer" type="submit">
          Login
        </button>
        <div className="mt-4 text-center">
          <a href="/auth/signup" className="text-black underline cursor-pointer">Don't have an account? Sign Up</a>
        </div>
      </form>
    </div>
  );
}
