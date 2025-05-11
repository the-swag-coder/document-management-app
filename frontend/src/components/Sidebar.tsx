'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const r = sessionStorage.getItem(`${process.env.NEXT_PUBLIC_APP}_ROLE`);
      setRole(r);
    }
  }, []);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-white shadow"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`flex flex-col py-6 px-4 w-64 h-full fixed top-0 left-0 z-40 bg-white shadow transition-transform duration-300 ease-in-out 
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:shadow-none`}
      >
        <h2 className="text-xl font-bold mb-8">Doc Management</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="hover:bg-gray-200 p-2 rounded">Dashboard</Link>
          <Link href="/documents" className="hover:bg-gray-200 p-2 rounded">Documents</Link>
          <Link href="/ingestion" className="hover:bg-gray-200 p-2 rounded">Ingestion</Link>
          <Link href="/qa" className="hover:bg-gray-200 p-2 rounded">Q&A</Link>
          {role === 'admin' && (
            <Link href="/users" className="hover:bg-gray-200 p-2 rounded">Users</Link>
          )}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
