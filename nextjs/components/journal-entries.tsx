'use client'

import { useState } from 'react'
import { Calendar, Clock, Tag, ChevronRight, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

const mockEntries = [
  {
    id: 1,
    date: '2025-06-01',
    time: '10:30 AM',
    title: 'Morning Reflection',
    content: 'Today was productive. I made significant progress on the MindLoom project. The new UI is coming together nicely.',
    mood: '😊',
    tags: ['personal-growth', 'work'],
    duration: '5 min'
  },
  {
    id: 2,
    date: '2025-05-31',
    time: '8:45 PM',
    title: 'Goal Progress Update',
    content: 'Reviewed my monthly goals. Happy to see 80% completion rate. Need to focus more on health goals next month.',
    mood: '🎯',
    tags: ['goals', 'reflection'],
    duration: '8 min'
  },
  {
    id: 3,
    date: '2025-05-30',
    time: '7:00 PM',
    title: 'Evening Thoughts',
    content: 'Feeling grateful for the support from my team. The hackathon preparation is going well.',
    mood: '🤔',
    tags: ['gratitude', 'work'],
    duration: '6 min'
  }
]

interface JournalEntriesProps {
  searchQuery: string
}

export function JournalEntries({ searchQuery }: JournalEntriesProps) {
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const filteredEntries = mockEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !filterTag || entry.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="h-full flex">
      {/* Entries List */}
      <div className="w-1/3 border-r border-white/10 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Entries</h2>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          
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
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-lg leading-relaxed">{entry.content}</p>
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