'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, Brain } from 'lucide-react';

export default function DailySummary({ date }: { date: string }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/daily-summary?date=${date}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch summary');
        }
        return data;
      })
      .then((data) => {
        setSummary(data.summary || 'No summary available');
        if (data.error) {
          console.warn('Summary warning:', data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Summary error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [date]);

  // Parse summary into sections if it contains markdown-like formatting
  const parseSummary = (text: string) => {
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
    }).filter(Boolean);
  };

  const sections = parseSummary(summary);

  return (
    <div className="bg-black/30 rounded-xl border border-white/10 backdrop-blur-sm">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bricolage font-bold">AI Summary</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">AI-generated summary for {date}</p>
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-gray-400 text-sm">Analyzing your conversations...</p>
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
              sections.map((section: any, index: number) => (
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
