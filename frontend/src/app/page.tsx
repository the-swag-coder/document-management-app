'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/utils/auth';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login');
    }
  }, [router]);
  return null;
}