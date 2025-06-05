'use client'

import { useState } from 'react'
import { Conversation } from '@/app/components/conversation'
import { JournalSidebar } from '@/components/journal-sidebar'
import { JournalEntries } from '@/components/journal-entries'
import { AuthGuard } from '@/components/AuthGuard'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Filter,
  X,
} from 'lucide-react'

export default function JournalPage() {
  // Using only conversation view as entries view is not currently needed
  const [activeView] = useState<'conversation' | 'entries'>('conversation')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filters = [
    { id: 'goals', name: 'Goals' },
    { id: 'emotions', name: 'Emotions' },
    { id: 'insights', name: 'Insights' },
    { id: 'decisions', name: 'Decisions' },
  ]

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    )
  }

  return (
    <AuthGuard redirectTo="/journal">
      <div className="flex h-screen pt-14">
        {/* Sidebar */}
        <JournalSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl py-1">
          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bricolage font-bold flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-indigo-400" />
                  Voice Journal
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Express your thoughts naturally through conversation
                </p>
              </div>
              
              {/* Voice button removed as requested */}
            </div>

            {/* Search filters - only visible when in entries view */}
            {activeView === 'entries' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-3 pb-1"
              >
                <div className="flex items-center gap-3">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => toggleFilter(filter.id)}
                        className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 transition-colors ${
                          activeFilters.includes(filter.id)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {filter.name}
                        {activeFilters.includes(filter.id) && (
                          <X className="h-3 w-3" />
                        )}
                      </button>
                    ))}

                    {activeFilters.length > 0 && (
                      <button
                        onClick={() => setActiveFilters([])}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto"
          >
            {activeView === 'conversation' ? (
              <div className="min-h-full flex items-center justify-center py-4 px-4">
                <div className="w-full" style={{ maxWidth: '700px' }}>
                  <Conversation />
                </div>
              </div>
            ) : (
              <JournalEntries
                searchQuery=""
                filters={activeFilters}
              />
            )}
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  )
}
