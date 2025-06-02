'use client';

import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InsightsPage() {
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
              <BarChart3 className="h-4 w-4 text-green-400" />
              <span className="text-green-300">Insight Trends</span>
            </div>

            {/* Gradient Main Heading */}
            <h1 className="font-bricolage text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300">
              We&apos;re working on some amazing insights for you!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
