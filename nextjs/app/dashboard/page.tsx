'use client';

import DailyLogs from '@/components/DailyLogs';
import DailySummary from '@/components/DailySummary';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, BarChart3, Sparkles } from 'lucide-react';
import { BackgroundWaves } from '@/components/background-waves';

export default function Dashboard() {
  // Use a date from 2025 to match the screenshot
  const today = new Date('2025-06-02');
  const [selectedDate, setSelectedDate] = useState(
    '2025-06-01' // Start with June 1, 2025
  );

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    if (current <= today) {
      setSelectedDate(current.toISOString().split('T')[0]);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = selectedDate === today.toISOString().split('T')[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundWaves />
      
      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <span className="text-gray-200">Daily Dashboard</span>
            </div>
            
            <h1 className="font-bricolage text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Your Daily Journey
              </span>
            </h1>
          </motion.div>

          {/* Date Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Calendar className="h-5 w-5 text-indigo-400" />
              <span className="font-medium text-lg">{formatDisplayDate(selectedDate)}</span>
              {isToday && (
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Today
                </span>
              )}
            </div>
            
            <button
              onClick={() => changeDate(1)}
              disabled={isToday}
              className={`p-2 rounded-lg transition-colors ${
                isToday 
                  ? 'bg-white/5 border border-white/5 opacity-50 cursor-not-allowed' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DailyLogs date={selectedDate} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DailySummary date={selectedDate} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
