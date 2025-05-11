'use client';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthGuard } from 'src/auth/guard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from 'src/components/loading-screen';

const VALID_EMAIL = 'admin@example.com';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('auth');

    try {
      const parsed = auth ? JSON.parse(auth) : null;

      if (!parsed || parsed.email !== VALID_EMAIL) {
        localStorage.removeItem('auth');
        router.push('/auth/jwt/sign-in');
      } else {
        setLoading(false);
      }
    } catch {
      localStorage.removeItem('auth');
      router.push('/auth/jwt/sign-in');
    }
  }, [router]);

  // If the authentication is still being checked, show loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // You can add the AuthGuard back if needed in the futuredf
  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}
