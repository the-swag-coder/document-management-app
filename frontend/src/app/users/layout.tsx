'use client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function UsersLayout({ children }: {children: React.ReactNode}) {
  return (
    <div className="flex h-screen">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Header title="User Management"/>
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
} 