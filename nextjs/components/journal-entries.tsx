'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Clock,
  Tag,
  ChevronRight,
  Search,
  AlertCircle,
  Sparkles,
  Target,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface JournalEntry {
  id: number
  date: string
  time: string
  title: string
  content: string
  mood: string
  tags: string[]
  duration: string
  goals: string[]
  emotions: string[]
  insights: string[]
  decisions: string[]
  aiSummary: string
}

interface JournalEntriesProps {
  searchQuery: string
  filters?: string[]
}

export function JournalEntries({
  searchQuery,
  filters = [],
}: JournalEntriesProps) {
  const router = useRouter()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/journal-entries')
        if (!res.ok) throw new Error('Failed to fetch journal entries')
        const data = await res.json()
        setEntries(data)
      } catch (err: any) {
        setError(err.message || 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = searchQuery
      ? entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true

    const matchesFilters =
      filters.length === 0 ||
      filters.every((filter) => {
        switch (filter) {
          case 'goals':
            return entry.goals.length > 0
          case 'emotions':
            return entry.emotions.length > 0
          case 'insights':
            return entry.insights.length > 0
          case 'decisions':
            return entry.decisions.length > 0
          default:
            return true
        }
      })

    return matchesSearch && matchesFilters
  })

  useEffect(() => {
    if (filteredEntries.length > 0) {
      setSelectedEntry(filteredEntries[0].id)
    }
  }, [searchQuery, filters, entries])

  return (
    <div className="h-full flex">
      <div className="w-1/3 border-r border-white/10 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          {searchQuery || filters.length > 0 ? (
            <div className="flex items-center gap-2 text-indigo-400">
              <Search className="h-4 w-4" />
              <h2 className="text-lg font-semibold">
                {filteredEntries.length}{' '}
                {filteredEntries.length === 1 ? 'Result' : 'Results'}
              </h2>
            </div>
          ) : (
            <h2 className="text-lg font-semibold">Recent Entries</h2>
          )}
        </div>

        {loading && (
          <p className="text-center text-gray-500 py-12">Loading entries...</p>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredEntries.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            No entries match your search
          </div>
        )}

        {!loading &&
          !error &&
          filteredEntries.map((entry, index) => (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => router.push(`/dashboard?date=${entry.date}`)}
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
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                {entry.content}
              </p>
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

      <div className="flex-1 overflow-y-auto p-8">
        <div className="text-center text-gray-500 mt-24">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select an entry to view details or go to Dashboard</p>
        </div>
      </div>
    </div>
  )
}
