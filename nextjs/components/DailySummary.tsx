'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, Brain, RefreshCw } from 'lucide-react';

type SummarySection = {
  type: string;
  content: string;
};

export default function DailySummary({ date }: { date: string }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [fromDatabase, setFromDatabase] = useState(false);

  const fetchSummary = useCallback((regenerate = false) => {
    setLoading(true);
    setError(null);
    if (regenerate) setRegenerating(true);
    
    // Check if date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    const isFutureDate = selectedDate > today;
    
    if (isFutureDate) {
      // Use mock data for future dates to avoid API errors
      setTimeout(() => {
        const mockSummary = `**Daily Summary**

This is a preview of how your summary will look. No real data is available for future dates.

**Key Topics**
• Productivity planning
• Goal setting
• Personal reflection

**Insights**
• Breaking down large tasks makes them more manageable
• Regular journaling helps track progress over time

**Emotions**
• Motivated to accomplish goals
• Calm and reflective mood`;
        
        setSummary(mockSummary);
        setLoading(false);
        setRegenerating(false);
        setFromDatabase(false);
      }, 800); // Simulate loading
      
      return;
    }
    
    // Normal fetch for past/current dates
    const url = regenerate 
      ? `/api/daily-summary?date=${date}&regenerate=true`
      : `/api/daily-summary?date=${date}`;
      
    fetch(url)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch summary');
        }
        return data;
      })
      .then((data) => {
        setSummary(data.summary || 'No summary available');
        setFromDatabase(!!data.fromDatabase);
        if (data.error) {
          console.warn('Summary warning:', data.error);
        }
        setLoading(false);
        setRegenerating(false);
      })
      .catch((error) => {
        console.error('Summary error:', error);
        // Use a more user-friendly error message
        setSummary('**Note**\n\nUnable to load summary for this date. The summary service is currently unavailable.');
        setLoading(false);
        setRegenerating(false);
        setFromDatabase(false);
      });
  }, [date]);
  
  useEffect(() => {
    fetchSummary();
  }, [date, fetchSummary]);
  
  const handleRegenerate = () => {
    fetchSummary(true);
  };

  // Parse summary into sections if it contains markdown-like formatting
  const parseSummary = (text: string): SummarySection[] => {
    const sections = text.split(/\*\*([^*]+)\*\*/g);
    return sections.map((section, index) => {
      if (index % 2 === 1) {
        // This is a header
        return { type: 'header', content: section };
      } else if (section.trim()) {
        // This is content
        return { type: 'content', content: section.trim() };
      }
      return null;
    }).filter((item): item is SummarySection => item !== null);
  };

  const sections = parseSummary(summary);

  return (
    <div className="bg-black/30 rounded-xl border border-white/10 backdrop-blur-sm h-full flex flex-col" style={{ height: '550px' }}>
      {/* Header - Not scrollable */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-bricolage font-bold">AI Summary</h2>
          </div>
          {fromDatabase && !loading && !error && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              Cached
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1">AI-generated summary for {date}</p>
      </div>

      {/* Content container - Scrollable */}
      <div className="p-6 overflow-y-auto flex-1">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="relative">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-gray-400 text-sm">
              {regenerating ? 'Regenerating summary...' : 'Analyzing your conversations...'}
            </p>
          </div>
        )}

        {error && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium">Failed to generate summary</p>
                <p className="text-red-400/70 text-sm mt-1">{error}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm text-center">
              Please check your Gemini API key configuration
            </p>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {sections.length > 0 ? (
              sections.map((section: { type: string; content: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {section.type === 'header' ? (
                    <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {section.content}
                    </h3>
                  ) : (
                    <div className="pl-6">
                      {section.content.split('\n').map((line: string, i: number) => (
                        <p key={i} className="text-gray-300 text-sm leading-relaxed mb-2">
                          {line.trim().startsWith('•') ? (
                            <span className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{line.substring(1).trim()}</span>
                            </span>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-6 border border-purple-500/20">
                <p className="text-gray-300 leading-relaxed">{summary}</p>
              </div>
            )}
            
            {/* Regenerate button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
                {regenerating ? 'Regenerating...' : 'Generate New Summary'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
