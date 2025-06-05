'use client'

import { useConversation } from '@elevenlabs/react'
import { useCallback, useRef, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Mic,
  MicOff,
  Loader2,
  Volume2,
  MessageCircle,
  Lock,
  UserX
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Conversation() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<
    { text: string; role: 'user' | 'agent' }[]
  >([])
  const conversationIdRef = useRef<string | null>(null)
  const dbConversationUUIDRef = useRef<string | null>(null)
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const [status, setStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected')
  const [authError, setAuthError] = useState<string | null>(null)

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Connected')
      setStatus('connected')
    },
    onDisconnect: () => {
      console.log('🛑 Disconnected')
      setStatus('disconnected')
    },
    onMessage: async (message) => {
      if (!user) return // Make sure user is authenticated
      
      const text = message?.text || JSON.stringify(message)
      const role = message?.source === 'ai' ? 'agent' : 'user'
      setMessages((prev) => [...prev, { text, role }])

      if (!dbConversationUUIDRef.current) return
      await supabase.from('transcripts').insert([
        {
          conversation_id: dbConversationUUIDRef.current,
          role,
          message: text,
          time_in_call_secs: message?.time_in_call_secs || null,
          user_id: user.id  // Add user_id to meet RLS requirements
        },
      ])
    },
    onError: (error) => {
      console.error('🚨 Error:', error)
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${error.message}`, role: 'agent' },
      ])
    },
  })

  const logUserMessage = async (text: string) => {
    if (!user) return // Make sure user is authenticated
    
    setMessages((prev) => [...prev, { text, role: 'user' }])
    if (!dbConversationUUIDRef.current) return
    await supabase.from('transcripts').insert([
      {
        conversation_id: dbConversationUUIDRef.current,
        role: 'user',
        message: text,
        time_in_call_secs: null,
        user_id: user.id  // Add user_id to meet RLS requirements
      },
    ])
  }

  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch('/api/signed-url')
    const { signedUrl } = await response.json()
    return signedUrl
  }

  const startConversation = useCallback(async () => {
    // First check authentication
    if (!user) {
      setAuthError('Please sign in to use the voice journal feature')
      router.push('/auth/signin?redirectTo=/journal')
      return
    }

    try {
      setStatus('connecting')
      setAuthError(null)
      
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const signedUrl = await getSignedUrl()

      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
      const conversationId = await conversation.startSession({
        signedUrl,
        agentId,
        dynamicVariables: { user_name: userName },
      })

      conversationIdRef.current = conversationId
      await supabase.from('conversations').insert([
        {
          agent_id: agentId,
          conversation_id: conversationId,
          agent_name: 'MindAgent',
          status: 'started',
          user_id: user.id  // Add user_id to meet RLS requirements
        },
      ])
      const { data } = await supabase
        .from('conversations')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)  // Filter by user_id for RLS
        .single()

      dbConversationUUIDRef.current = data.id
      await logUserMessage('Hi there, just journaling my thoughts...')
    } catch (error) {
      console.error('❌ Error starting conversation:', error)
      setStatus('disconnected')
      
      // Handle specific authentication errors
      if (error.message?.includes('auth') || error.message?.includes('permission')) {
        setAuthError('Authentication required. Please sign in to continue.')
        router.push('/auth/signin?redirectTo=/journal')
      }
    }
  }, [conversation, user, userName, router])

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setStatus('disconnected')
    } catch (err) {
      console.error('❌ Failed to stop conversation:', err)
      setStatus('disconnected')
    }
  }, [conversation])

  // Show authentication error if user is not authenticated
  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
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

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    )
  }

  // Show auth error if there's one
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <div className="p-8 rounded-full bg-red-500/20 border border-red-500/30">
          <UserX className="h-12 w-12 text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-red-400">Authentication Error</h3>
          <p className="text-gray-400 max-w-md">{authError}</p>
        </div>
        <motion.button
          onClick={() => router.push('/auth/signin?redirectTo=/journal')}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go to Sign In
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4 mx-auto" style={{ maxWidth: '700px' }}>
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bricolage font-bold">
          {status === 'connected' ? 'Listening...' : 'Ready to Start'}
        </h2>
        <p className="text-gray-400">
          {status === 'connected'
            ? "Speak naturally, I'm here to listen"
            : 'Click the microphone to begin your voice journal'}
        </p>
      </div>

      <div className="relative">
        <motion.button
          onClick={
            status === 'connected' ? stopConversation : startConversation
          }
          disabled={status === 'connecting'}
          className={cn(
            'relative p-8 rounded-full transition-all duration-300',
            status === 'connected'
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
              : 'bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/50',
            status === 'connecting' && 'opacity-50 cursor-not-allowed'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {status === 'connecting' ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : status === 'connected' ? (
            <MicOff className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </motion.button>

        {status === 'connected' && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50 animation-delay-200" />
          </>
        )}
      </div>

      {/* Mic instruction banner */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
        <span className="text-gray-200">Say "goodbye" to stop recording</span>
      </div>

      {conversation.isSpeaking && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 text-indigo-400"
        >
          <Volume2 className="h-4 w-4 animate-pulse" />
          <span className="text-sm">AI is speaking...</span>
        </motion.div>
      )}

      <div className="w-full mt-5">
        <div className="flex items-center space-x-2 mb-1">
          <MessageCircle className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold">Conversation</h3>
        </div>

        <div className="bg-black/40 rounded-xl border-2 border-indigo-500/20 p-3 h-[270px] overflow-y-auto space-y-3 shadow-lg shadow-indigo-500/10">
          <AnimatePresence>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                <MessageCircle className="h-8 w-8 text-indigo-400/50" />
                <p className="text-gray-400">
                  Your conversation will appear here...
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-3 rounded-2xl',
                      msg.role === 'user'
                        ? 'bg-indigo-500/20 text-indigo-100 border border-indigo-500/30'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    )}
                  >
                    <p className="text-sm leading-relaxed">
                      {(() => {
                        try {
                          const parsed = JSON.parse(msg.text)
                          if (typeof parsed === 'object' && parsed.message)
                            return parsed.message
                        } catch {}
                        return msg.text
                      })()}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}