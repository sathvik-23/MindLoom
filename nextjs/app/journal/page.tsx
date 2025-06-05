'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Conversation } from '@/app/components/conversation'
import { JournalSidebar } from '@/components/journal-sidebar'
import { JournalEntries } from '@/components/journal-entries'
import { useAuth } from '@/app/context/AuthContext'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Filter,
  X,
  Loader2,
  Lock
} from 'lucide-react'

export default function JournalPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirectTo=/journal')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    )
  }

  // Show authentication required message if not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="p-8 rounded-full bg-red-500/20 border border-red-500/30">
          <Lock className="h-12 w-12 text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-red-400">Authentication Required</h3>
          <p className="text-gray-400 max-w-md">
            Please sign in to access the voice journal feature. Your conversations are private and secure.
          </p>
        </div>
        <motion.button
          onClick={() => router.push('/auth/signin?redirectTo=/journal')}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign In to Continue
        </motion.button>
      </div>
    )
  }

  return (
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
    </div>
  )
}
