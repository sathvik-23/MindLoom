'use client'

import { useState, useEffect } from 'react'
import { Target, TrendingUp, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { fetchGoals } from '@/app/lib/goalUtils'

const recentEntries = [
  { id: 1, date: 'Jun 1', title: 'Morning Reflection', mood: '😊', dateParam: '2025-06-01' },
  { id: 2, date: 'May 31', title: 'Goal Progress Update', mood: '🎯', dateParam: '2025-05-31' },
  { id: 3, date: 'May 30', title: 'Evening Thoughts', mood: '🤔', dateParam: '2025-05-30' },
  { id: 4, date: 'May 29', title: 'Gratitude Practice', mood: '🙏', dateParam: '2025-05-29' },
]

interface Goal {
  id: string;
  name: string;
  progress: number;
  category: string;
  created_at?: string;
}

export function JournalSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)
  const router = useRouter()
  
  // Fetch goals from the API
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const getGoals = async () => {
      if (!isMounted) return;
      
      setLoadingGoals(true);
      try {
        const goalsData = await fetchGoals();
        if (isMounted) {
          setGoals(goalsData);
          // Reset retry count on success
          retryCount = 0;
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        // If we're still under max retries, retry after a delay
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(getGoals, 2000 * retryCount); // Exponential backoff
        }
      } finally {
        if (isMounted) {
          setLoadingGoals(false);
        }
      }
    };
    
    getGoals();
    
    // Set up interval to refresh goals (every 30 seconds to reduce API load)
    const intervalId = setInterval(() => {
      getGoals();
    }, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [])

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn(
      "border-r border-white/10 bg-black/50 backdrop-blur-xl transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="h-full flex flex-col">
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 hover:bg-white/5 transition-colors"
        >
          <ChevronRight className={cn(
            "h-5 w-5 transition-transform",
            !collapsed && "rotate-180"
          )} />
        </button>
        
        {!collapsed && (
          <>
            {/* Recent Entries */}
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Recent Entries
              </h3>
              <div className="space-y-2">
                {recentEntries.map((entry) => (
                  <button
                    key={entry.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group"
                    onClick={() => router.push(`/dashboard?date=${entry.dateParam}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{entry.mood}</span>
                        <div>
                          <p className="text-sm font-medium">{entry.title}</p>
                          <p className="text-xs text-gray-400">{entry.date}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Goals */}
            <div className="px-4 py-2 mt-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  Goal Progress
                </div>
                
                {/* Add goal tip */}
                <div className="text-[10px] text-gray-500 flex items-center">
                  <span className="mr-1">Ask AI to add goals</span>
                  <Plus className="h-2.5 w-2.5" />
                </div>
              </h3>
              
              {/* Loading state */}
              {loadingGoals && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                </div>
              )}
              
              {/* Empty state */}
              {!loadingGoals && goals.length === 0 && (
                <div className="p-4 rounded-lg border border-dashed border-white/10 text-center">
                  <p className="text-sm text-gray-400">No goals yet</p>
                  <p className="text-xs text-gray-500 mt-1">Ask the AI to add a goal for you</p>
                </div>
              )}
              
              {/* Goals list */}
              {!loadingGoals && goals.length > 0 && (
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{goal.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                          {goal.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mr-2">
                          <div
                            className={cn("h-full rounded-full", getProgressColor(goal.progress))}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium whitespace-nowrap">{goal.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="px-4 py-2 mt-auto mb-4">
              <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium">Your Streak</span>
                </div>
                <p className="text-2xl font-bold">7 days</p>
                <p className="text-xs text-gray-400 mt-1">Keep it going!</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}