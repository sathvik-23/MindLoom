'use client';

import { useAuth } from '@/app/context/AuthContext';
import { ProtectedMicButton } from '@/components/ProtectedMicButton';
import { AuthGuard } from '@/components/AuthGuard';
import { ConvAI } from '@/components/ConvAI';

export default function AuthTestPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Authentication Test Page</h1>
        
        {/* Auth Status */}
        <div className="bg-black/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
          {loading ? (
            <p className="text-yellow-400">Loading...</p>
          ) : user ? (
            <div className="text-green-400">
              <p>✅ Authenticated as: {user.email}</p>
              <p>User ID: {user.id}</p>
            </div>
          ) : (
            <p className="text-red-400">❌ Not authenticated</p>
          )}
        </div>

        {/* Protected Mic Buttons */}
        <div className="bg-black/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Protected Mic Buttons</h2>
          <div className="flex gap-4 items-center justify-center">
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-400">Small</p>
              <ProtectedMicButton size="sm" showText />
            </div>
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-400">Medium</p>
              <ProtectedMicButton size="md" showText />
            </div>
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-400">Large</p>
              <ProtectedMicButton size="lg" showText />
            </div>
          </div>
        </div>

        {/* Auth Guard Test */}
        <div className="bg-black/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Auth Guard Test</h2>
          <AuthGuard>
            <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-lg text-green-300">
              🎉 This content is only visible to authenticated users!
            </div>
          </AuthGuard>
        </div>

        {/* ConvAI Component Test */}
        <div className="bg-black/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibent mb-4">ConvAI Component Test</h2>
          <ConvAI />
        </div>
      </div>
    </div>
  );
}
