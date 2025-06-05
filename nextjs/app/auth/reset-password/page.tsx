'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase/client';
import { BackgroundWaves } from '@/components/background-waves';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if we have the necessary hash parameter in URL for password reset
    const hasResetToken = 
      window.location.hash &&
      window.location.hash.includes('type=recovery');
    
    if (!hasResetToken) {
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect to sign in page after 3 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center relative">
        <BackgroundWaves />
        
        <div className="w-full max-w-md z-10">
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl text-center">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Password Updated!
            </h1>
            
            <p className="mb-6 text-gray-300">
              Your password has been successfully reset. You will be redirected to the sign in page in a moment.
            </p>
            
            <Link 
              href="/auth/signin"
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      <BackgroundWaves />
      
      <div className="w-full max-w-md z-10">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Reset Password
          </h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-none"
                placeholder="Min. 6 characters"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-none"
                placeholder="Confirm your new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(error)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-6"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>
              <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
