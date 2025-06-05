'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mic, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProtectedMicButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  redirectTo?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ProtectedMicButton({
  className,
  size = 'md',
  showText = false,
  redirectTo = '/journal',
  onClick,
  disabled = false
}: ProtectedMicButtonProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const sizeClasses = {
    sm: 'p-2 h-10 w-10',
    md: 'p-4 h-16 w-16',
    lg: 'p-6 h-20 w-20'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const handleClick = () => {
    if (loading || disabled) return;

    if (!user) {
      // Redirect to sign in with return URL
      router.push(`/auth/signin?redirectTo=${encodeURIComponent(redirectTo)}`);
      return;
    }

    // User is authenticated, proceed with the action
    if (onClick) {
      onClick();
    } else {
      // Default action: navigate to journal
      router.push(redirectTo);
    }
  };

  const getButtonContent = () => {
    if (loading) {
      return <Loader2 className={cn(iconSizes[size], 'animate-spin')} />;
    }

    if (!user) {
      return <Lock className={cn(iconSizes[size])} />;
    }

    return <Mic className={cn(iconSizes[size])} />;
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (!user) return 'Sign in to use voice journal';
    return 'Start voice journal';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={handleClick}
        disabled={loading || disabled}
        className={cn(
          'rounded-full transition-all duration-300 flex items-center justify-center',
          !user
            ? 'bg-gray-500 hover:bg-gray-600 shadow-lg shadow-gray-500/50'
            : 'bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/50',
          loading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105',
          sizeClasses[size],
          className
        )}
        whileHover={!loading && !disabled ? { scale: 1.05 } : {}}
        whileTap={!loading && !disabled ? { scale: 0.95 } : {}}
      >
        {getButtonContent()}
      </motion.button>

      {showText && (
        <p className={cn(
          'text-sm font-medium transition-colors',
          !user ? 'text-gray-400' : 'text-indigo-400'
        )}>
          {getButtonText()}
        </p>
      )}
    </div>
  );
}
