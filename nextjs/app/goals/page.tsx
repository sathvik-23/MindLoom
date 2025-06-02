'use client'

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
          {/* Header Section */}
          <div className="text-center mb-12">
            {/* Pill-style subtitle */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              {/* <Target className="h-4 w-4 text-orange-400" /> */}
              <span className="text-orange-300">🎯 Goal Progress Tracker</span>
            </div>

            {/* Main gradient title */}
            <h1 className="font-bricolage text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300">
              We&apos;re working on something amazing!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
