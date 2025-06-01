'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Loader2, AlertCircle, CheckCircle, XCircle, ArrowUpRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Goal {
  id: string;
  name: string;
  category: string;
  target: string;
  progress: number;
  progressHistory: {
    date: string;
    value: number;
  }[];
  status: 'on-track' | 'at-risk' | 'behind';
  streak: number;
}

export default function GoalTracker({ date }: { date: string }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  useEffect(() => {
    // This would normally fetch from an API
    // For now, we'll use mock data based on the dummy data in the DB
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockGoals: Goal[] = [
        {
          id: '1',
          name: 'Exercise Routine',
          category: 'Fitness',
          target: '4 workouts per week',
          progress: 0.75, // 3 out of 4 workouts
          progressHistory: [
            { date: '2025-05-25', value: 0.5 },
            { date: '2025-05-26', value: 0.5 },
            { date: '2025-05-27', value: 0.75 },
            { date: '2025-05-28', value: 0.75 },
            { date: '2025-05-29', value: 0.75 },
            { date: '2025-05-30', value: 1.0 },
            { date: '2025-05-31', value: 0.75 },
          ],
          status: 'on-track',
          streak: 7
        },
        {
          id: '2',
          name: 'Python Learning',
          category: 'Education',
          target: '3 lessons per week',
          progress: 0.67, // 2 out of 3 lessons
          progressHistory: [
            { date: '2025-05-25', value: 0.33 },
            { date: '2025-05-26', value: 0.67 },
            { date: '2025-05-27', value: 0.67 },
            { date: '2025-05-28', value: 0.33 },
            { date: '2025-05-29', value: 0.67 },
            { date: '2025-05-30', value: 0.67 },
            { date: '2025-05-31', value: 0.67 },
          ],
          status: 'on-track',
          streak: 5
        },
        {
          id: '3',
          name: 'Work-Life Balance',
          category: 'Wellbeing',
          target: 'Leave by 6PM at least 4 days',
          progress: 0.75, // 3 out of 4 days
          progressHistory: [
            { date: '2025-05-25', value: 0.5 },
            { date: '2025-05-26', value: 0.75 },
            { date: '2025-05-27', value: 0.5 },
            { date: '2025-05-28', value: 0.75 },
            { date: '2025-05-29', value: 0.75 },
            { date: '2025-05-30', value: 0.75 },
            { date: '2025-05-31', value: 0.75 },
          ],
          status: 'on-track',
          streak: 4
        },
        {
          id: '4',
          name: 'Meditation',
          category: 'Mindfulness',
          target: '10 minutes daily',
          progress: 0.86, // 6 out of 7 days
          progressHistory: [
            { date: '2025-05-25', value: 0.71 },
            { date: '2025-05-26', value: 0.86 },
            { date: '2025-05-27', value: 0.86 },
            { date: '2025-05-28', value: 0.71 },
            { date: '2025-05-29', value: 0.86 },
            { date: '2025-05-30', value: 0.86 },
            { date: '2025-05-31', value: 0.86 },
          ],
          status: 'on-track',
          streak: 6
        }
      ];
      
      setGoals(mockGoals);
      setSelectedGoal(mockGoals[0].id);
      setLoading(false);
    }, 1000);
  }, [date]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-400';
      case 'at-risk':
        return 'text-yellow-400';
      case 'behind':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 0.75) return 'bg-green-500';
    if (progress >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const currentGoal = goals.find(g => g.id === selectedGoal);

  return (
    <div className="bg-black/30 rounded-xl border border-white/10 backdrop-blur-sm">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-bricolage font-bold">Goal Tracker</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">Track your progress towards your goals</p>
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-green-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && goals.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No goals found. Add goals in your settings.
          </p>
        )}

        {!loading && !error && goals.length > 0 && (
          <div className="space-y-6">
            {/* Goal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {goals.map((goal) => (
                <motion.button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "p-4 rounded-lg border transition-all text-left",
                    selectedGoal === goal.id
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white">
                      {goal.category}
                    </span>
                    <span className={cn("text-xs font-medium", getStatusColor(goal.status))}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-3">{goal.name}</h3>
                  <div className="mb-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", getProgressColor(goal.progress))}
                        style={{ width: `${goal.progress * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{Math.round(goal.progress * 100)}%</span>
                    <span className="text-gray-400">Target: {goal.target}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Selected Goal Details */}
            {currentGoal && (
              <motion.div
                key={currentGoal.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-5 rounded-lg border border-white/10 bg-white/5"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{currentGoal.name}</h3>
                    <p className="text-sm text-gray-400">Target: {currentGoal.target}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Streak:</span>
                      <span className="text-green-400 font-bold">{currentGoal.streak} days</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Updated today</p>
                  </div>
                </div>

                {/* Progress History */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Weekly Progress</span>
                  </h4>
                  <div className="grid grid-cols-7 gap-1">
                    {currentGoal.progressHistory.map((day, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-1">{formatDate(day.date)}</div>
                        <div 
                          className={cn(
                            "w-full h-16 rounded-md relative overflow-hidden",
                            "border border-white/10 flex items-end"
                          )}
                        >
                          <div 
                            className={cn(
                              "w-full transition-all",
                              getProgressColor(day.value)
                            )}
                            style={{ height: `${day.value * 100}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                            {Math.round(day.value * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis */}
                <div className="mt-6 p-4 rounded-lg bg-black/20 border border-white/10">
                  <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                  <p className="text-sm text-gray-300">
                    {currentGoal.name === 'Exercise Routine' && (
                      "You're consistently hitting 75% of your workout goal. Consider scheduling your 4th weekly workout on a specific day to reach 100%."
                    )}
                    {currentGoal.name === 'Python Learning' && (
                      "Your Python learning has been steady at 67%. Based on your journal entries, morning study sessions are most productive for you."
                    )}
                    {currentGoal.name === 'Work-Life Balance' && (
                      "Great progress on work-life balance! Your breakthrough insight about self-worth is helping you maintain boundaries at work."
                    )}
                    {currentGoal.name === 'Meditation' && (
                      "Your meditation practice is becoming a strong habit at 86% consistency. You've noted improved focus on days following meditation."
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
