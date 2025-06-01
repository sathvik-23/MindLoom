'use client'

import { useState } from 'react'
import { Conversation } from '../components/conversation'
import { JournalSidebar } from '@/components/journal-sidebar'
import { JournalEntries } from '@/components/journal-entries'
import { motion } from 'framer-motion'
import { BookOpen, Mic, Calendar, Tag, Search } from 'lucide-react'

export default function JournalPage() {
  const [activeView, setActiveView] = useState<'conversation' | 'entries'>('conversation')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <JournalSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="px-6 py-4">
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
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>                
                <div className="flex bg-white/5 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView('conversation')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeView === 'conversation'
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Mic className="h-4 w-4 inline mr-2" />
                    Voice
                  </button>
                  <button
                    onClick={() => setActiveView('entries')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeView === 'entries'
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Entries
                  </button>
                </div>
              </div>
            </div>
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
            className="h-full"
          >
            {activeView === 'conversation' ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-4xl w-full">
                  <Conversation />
                </div>
              </div>
            ) : (
              <JournalEntries searchQuery={searchQuery} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}