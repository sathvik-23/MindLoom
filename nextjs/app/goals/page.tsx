'use client'

import { Target, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function GoalsPage() {
  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bricolage font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Your Goals
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Track your progress and achieve your dreams
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Goal cards will go here */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-orange-400" />
                <span className="text-sm text-gray-400">75% Complete</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete MindLoom MVP</h3>
              <p className="text-gray-400 text-sm mb-4">
                Build and launch the first version of MindLoom with core features
              </p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}