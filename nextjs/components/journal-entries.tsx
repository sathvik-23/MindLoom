'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Tag, ChevronRight, Filter, Target, Search, AlertCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Enhanced mock entries with more detailed data and goal references
const mockEntries = [
  {
    id: 1,
    date: '2025-06-01',
    time: '10:30 AM',
    title: 'Morning Reflection',
    content: 'Today was productive. I made significant progress on the MindLoom project. The new UI is coming together nicely. I need to focus more on the core features before the hackathon deadline.',
    mood: '😊',
    tags: ['personal-growth', 'work'],
    duration: '5 min',
    goals: ['Python Learning'],
    emotions: ['excited', 'motivated'],
    insights: ['Need to prioritize core features'],
    decisions: ['Focus on UI tomorrow'],
    aiSummary: 'Productive day with focus on MindLoom UI development. Excited about progress but aware of need to prioritize core features before the hackathon deadline.'
  },
  {
    id: 2,
    date: '2025-05-31',
    time: '8:45 PM',
    title: 'Goal Progress Update',
    content: 'Reviewed my monthly goals. Happy to see 80% completion rate. Need to focus more on health goals next month. Exercise routine has been consistent 3 times per week, but I want to reach 4 workouts weekly. Python learning is on track with 2 modules completed this week.',
    mood: '🎯',
    tags: ['goals', 'reflection'],
    duration: '8 min',
    goals: ['Exercise Routine', 'Python Learning'],
    emotions: ['proud', 'determined'],
    insights: ['Consistency is key to reaching goals'],
    decisions: ['Schedule 4th workout for Sunday'],
    aiSummary: 'Monthly goal review shows 80% completion rate. Exercise routine at 75% (3/4 workouts) and Python learning on track. Clear decision to improve health focus next month.'
  },
  {
    id: 3,
    date: '2025-05-30',
    time: '7:00 PM',
    title: 'Evening Thoughts',
    content: 'Feeling grateful for the support from my team. The hackathon preparation is going well. Left work by 6 PM today, maintaining my work-life balance goal. Spent 15 minutes meditating this morning and felt focused all day.',
    mood: '🤔',
    tags: ['gratitude', 'work'],
    duration: '6 min',
    goals: ['Work-Life Balance', 'Meditation'],
    emotions: ['grateful', 'relaxed'],
    insights: ['Meditation improves daily focus'],
    decisions: ['Continue morning meditation practice'],
    aiSummary: 'Strong gratitude for team support and good progress on hackathon preparation. Successfully maintaining work-life balance by leaving at 6 PM. Morning meditation correlates with improved focus.'
  },
  {
    id: 4,
    date: '2025-05-29',
    time: '9:15 PM',
    title: 'Breakthrough Moment',
    content: 'Had a major insight during meditation today. I realized I've been tying my self-worth to productivity at work, which explains why it's been hard to maintain work-life balance. When I leave at 6 PM, I feel guilty even though I'm actually more productive the next day. This realization changes everything.',
    mood: '💡',
    tags: ['insight', 'personal-growth'],
    duration: '10 min',
    goals: ['Work-Life Balance', 'Meditation'],
    emotions: ['insightful', 'relieved'],
    insights: ['Self-worth tied to productivity creates imbalance', 'Quality over quantity in work'],
    decisions: ['Reframe leaving at 6 PM as self-care'],
    aiSummary: 'Profound breakthrough connecting self-worth to work productivity. Recognition that guilt when leaving at 6 PM stems from this connection. Decision to reframe boundaries as self-care that actually improves productivity.'
  }
]

interface JournalEntriesProps {
  searchQuery: string
  filters?: string[]
}

export function JournalEntries({ searchQuery, filters = [] }: JournalEntriesProps) {
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  
  // Effect to highlight first entry when search/filters change
  useEffect(() => {
    setIsSearching(searchQuery.length > 0 || filters.length > 0)
    
    // Select first matching entry when search results change
    if (filteredEntries.length > 0 && (searchQuery || filters.length > 0)) {
      setSelectedEntry(filteredEntries[0].id)
    }
  }, [searchQuery, filters])
  
  const filteredEntries = mockEntries.filter(entry => {
    // Match search query
    const matchesSearch = searchQuery ? 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) :
      true
    
    // Match all active filters
    const matchesFilters = filters.length === 0 || filters.every(filter => {
      switch(filter) {
        case 'goals':
          return entry.goals && entry.goals.length > 0
        case 'emotions':
          return entry.emotions && entry.emotions.length > 0
        case 'insights': 
          return entry.insights && entry.insights.length > 0
        case 'decisions':
          return entry.decisions && entry.decisions.length > 0
        default:
          return true
      }
    })
    
    return matchesSearch && matchesFilters
  })

  return (
    <div className="h-full flex">
      {/* Entries List */}
      <div className="w-1/3 border-r border-white/10 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            {isSearching ? (
              <div className="flex items-center gap-2 text-indigo-400">
                <Search className="h-4 w-4" />
                <h2 className="text-lg font-semibold">
                  {filteredEntries.length} {filteredEntries.length === 1 ? 'Result' : 'Results'}
                </h2>
              </div>
            ) : (
              <h2 className="text-lg font-semibold">Recent Entries</h2>
            )}
          </div>
          
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-3">
              <AlertCircle className="h-8 w-8 text-gray-500" />
              <p>No entries match your search</p>
              {searchQuery && (
                <button 
                  onClick={() => {
                    // This would be handled by the parent component in a real app
                    // window.location.href = '/journal'
                  }}
                  className="text-indigo-400 text-sm hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEntries.map((entry, index) => (
                <motion.button
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedEntry(entry.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedEntry === entry.id
                      ? 'bg-indigo-500/20 border border-indigo-500/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{entry.mood}</span>
                      <h3 className="font-medium">{entry.title}</h3>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-1" />
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">{entry.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {entry.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.duration}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Entry Detail */}
      <div className="flex-1 overflow-y-auto">
        {selectedEntry ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8"
          >
            {(() => {
              const entry = mockEntries.find(e => e.id === selectedEntry)
              if (!entry) return null
              
              return (
                <>
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bricolage font-bold mb-2 flex items-center gap-3">
                          <span className="text-4xl">{entry.mood}</span>
                          {entry.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {entry.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {entry.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {entry.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Goals */}
                    {entry.goals && entry.goals.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm uppercase text-gray-400 mb-3 flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Related Goals
                        </h3>
                        <div className="flex gap-2">
                          {entry.goals.map((goal) => (
                            <span
                              key={goal}
                              className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm flex items-center gap-1"
                            >
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex gap-2 mb-6">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="prose prose-invert max-w-none mb-8">
                      <p className="text-lg leading-relaxed">{entry.content}</p>
                    </div>
                    
                    {/* AI Summary & Analysis */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-6 border border-purple-500/20 mb-8">
                      <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Summary
                      </h3>
                      <p className="text-gray-300">{entry.aiSummary}</p>
                    </div>
                    
                    {/* Insights & Decisions */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {entry.insights && entry.insights.length > 0 && (
                        <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
                          <h3 className="text-sm font-semibold mb-2">Key Insights</h3>
                          <ul className="space-y-2">
                            {entry.insights.map((insight, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {entry.decisions && entry.decisions.length > 0 && (
                        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                          <h3 className="text-sm font-semibold mb-2">Decisions Made</h3>
                          <ul className="space-y-2">
                            {entry.decisions.map((decision, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{decision}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )
            })()}
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an entry to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}