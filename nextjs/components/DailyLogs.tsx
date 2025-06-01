'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transcript {
  id: string;
  conversation_id: string;
  role: string;
  message: string;
  created_at: string;
}

export default function DailyLogs({ date }: { date: string }) {
  const [logs, setLogs] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse message if it's a JSON string
  const parseMessage = (message: string) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.message) return parsed.message;
      if (parsed.text) return parsed.text;
      return message;
    } catch {
      return message;
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/daily-logs?date=${date}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
      })
      .then((data) => {
        // Clean up the messages
        const cleanedLogs = (data || []).map((log: Transcript) => ({
          ...log,
          message: parseMessage(log.message)
        }));
        setLogs(cleanedLogs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [date]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-black/30 rounded-xl border border-white/10 backdrop-blur-sm">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-indigo-400" />
          <h2 className="text-xl font-bricolage font-bold">Daily Conversations</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">Your voice journal entries for {date}</p>
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No conversations found for this date
          </p>
        )}

        {!loading && !error && logs.length > 0 && (
          <AnimatePresence>
            <div className="space-y-4">
              {logs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    'flex',
                    log.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-3 rounded-2xl',
                      log.role === 'user'
                        ? 'bg-indigo-500/20 text-indigo-100 border border-indigo-500/30'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatTime(log.created_at)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
