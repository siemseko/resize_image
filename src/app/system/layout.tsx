'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
const VALID_USERS = [
  'admin_ai@gmail.com',
  'user1@gmail.com',
  'user2@gmail.com',
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('auth');

    try {
      const parsed = auth ? JSON.parse(auth) : null;

      if (!parsed || !VALID_USERS.includes(parsed.email)) {
        localStorage.removeItem('auth');
        router.push('/login');
      } else {
        setLoading(false);
      }
    } catch {
      localStorage.removeItem('auth');
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <main className=" bg-[#f5f5f5] overflow-auto flex-1 black-scrollbar">{children}</main>
    </div>
  )
}
