'use client'

import { Settings, User, Bell, Shield, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <h1 className="text-4xl font-bricolage font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Customize your MindLoom experience
            </p>
          </div>
          
          <div className="space-y-6">
            <motion.div
              whileHover={{ x: 5 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <User className="h-6 w-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold">Profile</h3>
                  <p className="text-sm text-gray-400">Manage your account details</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ x: 5 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <Bell className="h-6 w-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p className="text-sm text-gray-400">Configure alerts and reminders</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}