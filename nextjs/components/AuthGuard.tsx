'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, redirectTo = '/journal', fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const redirectUrl = `/auth/signin?redirectTo=${encodeURIComponent(redirectTo)}`;
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return fallback || (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        <p className="mt-4 text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user) {
    return fallback || null;
  }

  return <>{children}</>;
}
