'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DailyLogs from '@/components/DailyLogs'
import DailySummary from '@/components/DailySummary'
import { motion } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, BarChart3, Loader2 } from 'lucide-react'
import { BackgroundWaves } from '@/components/background-waves'
import { useAuth } from '@/app/context/AuthContext'

// Component to handle the search params logic
function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const { user, loading: authLoading } = useAuth()

  const initialDate = searchParams.get('date') || todayStr
  const [selectedDate, setSelectedDate] = useState(initialDate)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirectTo=/dashboard')
    }
  }, [user, authLoading, router])

  // If still loading auth state or not authenticated, show loading
  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const changeDate = (days: number) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + days)
    if (current <= today) {
      setSelectedDate(current.toISOString().split('T')[0])
    }
  }

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isToday = selectedDate === todayStr

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundWaves />

      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <span className="text-gray-200">Daily Reflections</span>
            </div>

            <h1 className="font-bricolage text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Your Daily Journey
              </span>
            </h1>
            
            <p className="text-gray-300">
              Welcome back, {user?.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Calendar className="h-5 w-5 text-indigo-400" />
              <span className="font-medium text-lg">
                {formatDisplayDate(selectedDate)}
              </span>
              {isToday && (
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Today
                </span>
              )}
            </div>

            <button
              onClick={() => changeDate(1)}
              disabled={isToday}
              className={`p-2 rounded-lg transition-colors ${
                isToday
                  ? 'bg-white/5 border border-white/5 opacity-50 cursor-not-allowed'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: '600px' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="h-full"
              >
                <Suspense fallback={
                  <div className="bg-black/30 rounded-xl border border-white/10 backdrop-blur-sm h-full flex flex-col">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-indigo-400/30 animate-pulse"></div>
                        <div className="h-6 w-36 bg-white/10 rounded-md animate-pulse"></div>
                      </div>
                      <div className="h-4 w-48 bg-white/5 rounded-md mt-2 animate-pulse"></div>
                    </div>
                    <div className="flex-1 p-6 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full border-2 border-indigo-400/50 border-t-transparent animate-spin"></div>
                    </div>
                  </div>
                }>
                  <DailyLogs date={selectedDate} userId={user.id} />
                </Suspense>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="h-full"
              >
                <Suspense fallback={
                  <div className="bg-black/30 rounded-xl border border-white/10 backdrop-blur-sm h-full flex flex-col">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-purple-400/30 animate-pulse"></div>
                        <div className="h-6 w-36 bg-white/10 rounded-md animate-pulse"></div>
                      </div>
                      <div className="h-4 w-48 bg-white/5 rounded-md mt-2 animate-pulse"></div>
                    </div>
                    <div className="flex-1 p-6 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full border-2 border-purple-400/50 border-t-transparent animate-spin"></div>
                    </div>
                  </div>
                }>
                  <DailySummary date={selectedDate} userId={user.id} />
                </Suspense>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard component wrapped with Suspense
export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
