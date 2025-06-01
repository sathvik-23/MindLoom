'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Mic, Brain, Target, BarChart3, Sparkles, Zap, Shield } from 'lucide-react'
import { BackgroundWaves } from '@/components/background-waves'
import { useState, useEffect } from 'react'

const features = [
  {
    icon: Mic,
    title: "Voice-First Journaling",
    description: "Express yourself naturally through conversation with our AI companion. No typing required.",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Discover patterns, emotions, and growth opportunities from your journal entries.",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: Target,
    title: "Smart Goal Tracking",
    description: "Set, track, and achieve your goals with intelligent recommendations and progress monitoring.",
    color: "from-orange-400 to-red-400"
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Beautiful charts and visualizations to understand your journey and progress over time.",
    color: "from-green-400 to-emerald-400"
  }
]

const stats = [
  { value: "98%", label: "User Satisfaction" },
  { value: "2M+", label: "Journal Entries" },
  { value: "150K+", label: "Goals Achieved" },
  { value: "4.9★", label: "App Rating" }
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundWaves />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-8"
            >
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span className="text-gray-200">Introducing MindLoom 2.0</span>
            </motion.div>
            
            <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Transform Your Thoughts
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Into Insights
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Experience the future of journaling with AI-powered voice conversations, 
              intelligent goal tracking, and personalized insights that help you grow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  Start Journaling
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-bricolage text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to understand yourself better and achieve your goals.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                  />
                  <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="font-bricolage text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-20" />
            <div className="relative p-12 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10">
              <h2 className="font-bricolage text-4xl font-bold mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands who have transformed their lives through mindful journaling.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold hover:shadow-xl hover:shadow-white/25 transition-all duration-300"
                >
                  Get Started Free
                  <Zap className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}