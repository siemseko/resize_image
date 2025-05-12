'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const VALID_EMAIL = 'admin@gmail.com';  

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('auth');

    try {
      const parsed = auth ? JSON.parse(auth) : null;

      if (!parsed || parsed.email !== VALID_EMAIL) {
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

  if (loading) return <div className="p-6 text-center">Checking authentications...</div>;

  return <>{children}</>;
}
