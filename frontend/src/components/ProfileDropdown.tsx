'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/auth';

export default function ProfileDropdown() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = () => {
    logout('');
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-gray-200 px-3 py-2 rounded cursor-pointer"
      >
        <span>Profile</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}