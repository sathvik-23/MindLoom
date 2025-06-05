'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase/client';
import { BackgroundWaves } from '@/components/background-waves';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the reset link');
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
              Check Your Email
            </h1>
            
            <p className="mb-6 text-gray-300">
              If an account exists with {email}, we've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>
            
            <Link 
              href="/auth/signin"
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
            >
              Back to Sign In
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
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Reset Password
          </h1>
          
          <p className="text-gray-400 text-center mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>
              Remember your password?{' '}
              <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
