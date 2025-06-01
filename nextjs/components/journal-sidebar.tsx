'use client'

import { useState } from 'react'
import { Calendar, Hash, TrendingUp, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const recentEntries = [
  { id: 1, date: 'Jun 1', title: 'Morning Reflection', mood: '😊' },
  { id: 2, date: 'May 31', title: 'Goal Progress Update', mood: '🎯' },
  { id: 3, date: 'May 30', title: 'Evening Thoughts', mood: '🤔' },
  { id: 4, date: 'May 29', title: 'Gratitude Practice', mood: '🙏' },
]

const tags = [
  { name: 'personal-growth', count: 23 },
  { name: 'work', count: 18 },
  { name: 'relationships', count: 12 },
  { name: 'health', count: 15 },
]

export function JournalSidebar() {
  const [collapsed, setCollapsed] = useState(false)

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
            
            {/* Tags */}
            <div className="px-4 py-2 mt-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Popular Tags
              </h3>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <button
                    key={tag.name}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-3 w-3 text-indigo-400" />
                      <span className="text-sm">{tag.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{tag.count}</span>
                  </button>
                ))}
              </div>
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