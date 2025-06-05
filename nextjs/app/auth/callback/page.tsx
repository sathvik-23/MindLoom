'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';
import { BackgroundWaves } from '@/components/background-waves';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Try to exchange the code for a session
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error('Error during auth callback:', error);
        router.push('/auth/signin?error=Unable+to+verify+your+account');
      } else {
        // Auth successful, redirect to dashboard
        router.push('/dashboard');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      <BackgroundWaves />
      
      <div className="w-full max-w-md z-10 text-center">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Verifying...
          </h1>
          
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
          
          <p className="text-gray-300">
            Completing authentication. Please wait...
          </p>
        </div>
      </div>
    </div>
  );
}
