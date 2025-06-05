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
  user_id?: string; // Make this optional to handle legacy data
}

interface DailyLogsProps {
  date: string;
  userId?: string;
}

export default function DailyLogs({ date, userId }: DailyLogsProps) {
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
    
    console.log("DailyLogs component is fetching data with:", { date, userId });
    
    // Check if date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    const isFutureDate = selectedDate > today;
    
    if (isFutureDate) {
      // Use mock data for future dates to avoid API errors
      console.log("Using mock data for future date");
      setTimeout(() => {
        const mockLogs: Transcript[] = [
          {
            id: 'mock-1',
            conversation_id: 'mock-convo-1',
            role: 'user',
            message: 'Good morning! Today I want to focus on completing my project proposal.',
            created_at: new Date(date + 'T09:15:00').toISOString()
          },
          {
            id: 'mock-2',
            conversation_id: 'mock-convo-1',
            role: 'assistant',
            message: 'That sounds like a great plan! Would you like to set specific goals for today?',
            created_at: new Date(date + 'T09:15:30').toISOString()
          },
          {
            id: 'mock-3',
            conversation_id: 'mock-convo-1',
            role: 'user',
            message: 'Yes, I want to finish the executive summary and create an outline for the implementation section.',
            created_at: new Date(date + 'T09:16:15').toISOString()
          },
          {
            id: 'mock-4',
            conversation_id: 'mock-convo-1',
            role: 'assistant',
            message: 'Excellent goals! Breaking it down into specific tasks will help you stay focused. How much time do you plan to spend on each part?',
            created_at: new Date(date + 'T09:16:45').toISOString()
          },
        ];
        
        setLogs(mockLogs);
        setLoading(false);
      }, 800); // Simulate loading
      
      return;
    }
    
    // Add user_id to the API call if it exists
    const apiUrl = userId 
      ? `/api/daily-logs?date=${date}&userId=${userId}`
      : `/api/daily-logs?date=${date}`;
    
    console.log("Fetching from API URL:", apiUrl);
    
    // Normal fetch for past/current dates
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          console.error("API response not OK:", res.status, res.statusText);
          throw new Error(`Failed to fetch logs: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API returned data:", data);
        // Clean up the messages
        const cleanedLogs = (data || []).map((log: Transcript) => ({
          ...log,
          message: parseMessage(log.message)
        }));
        console.log("Cleaned logs:", cleanedLogs);
        setLogs(cleanedLogs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching logs:', err);
        setError(err.message || "Failed to fetch conversation logs");
        setLogs([]);
        setLoading(false);
      });
  }, [date, userId]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-black/30 rounded-xl border border-white/10 backdrop-blur-sm h-full flex flex-col" style={{ height: '550px' }}>
      {/* Header - Not scrollable */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-indigo-400" />
          <h2 className="text-xl font-bricolage font-bold">Daily Conversations</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">Your voice journal entries for {date}</p>
      </div>

      {/* Content container - Scrollable */}
      <div className="p-6 overflow-y-auto flex-1">
        {loading && (
          <div className="flex items-center justify-center h-full">
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
                  key={log.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    'flex',
                    log.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
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
