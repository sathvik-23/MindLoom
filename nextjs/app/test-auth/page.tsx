'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function AuthTest() {
  const { user, session, loading } = useAuth();

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <div className="p-8">
      <h1>Authentication Test</h1>
      <div className="mt-4">
        <h2>User:</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        
        <h2 className="mt-4">Session:</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  );
}
