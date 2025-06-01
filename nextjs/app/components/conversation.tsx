'use client'

import { useConversation } from '@elevenlabs/react'
import { useCallback, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Mic, MicOff, Loader2, Volume2, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Conversation() {
  const [messages, setMessages] = useState<{ text: string; role: 'user' | 'agent' }[]>([])
  const conversationIdRef = useRef<string | null>(null)
  const dbConversationUUIDRef = useRef<string | null>(null)
  const userName = 'Sathvik'

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Connected')
    },
    onDisconnect: () => {
      console.log('❌ Disconnected')
    },
    onMessage: async (message: {
      text?: string
      source?: string
      time_in_call_secs?: number
    }) => {
      console.log('📨 Message:', message)

      const text = message?.text || JSON.stringify(message)
      const role = message?.source === 'ai' ? 'agent' : 'user'

      setMessages((prev) => [...prev, { text, role }])

      if (!dbConversationUUIDRef.current) return

      const { error } = await supabase.from('transcripts').insert(
        [
          {
            conversation_id: dbConversationUUIDRef.current,
            role,
            message: text,
            time_in_call_secs: message?.time_in_call_secs || null,
          },
        ],
        { returning: 'minimal' }
      )

      if (error) {
        console.error('❌ Supabase insert error:', error)      } else {
        console.log('✅ Transcript saved')
      }
    },
    onError: (error: any) => {
      console.error('🚨 Error:', error)
      setMessages((prev) => [...prev, { text: `Error: ${error.message}`, role: 'agent' }])
    },
  })

  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch('/api/signed-url')
    if (!response.ok) {
      throw new Error(`Failed to fetch signed URL: ${response.status}`)
    }
    const { signedUrl } = await response.json()
    return signedUrl
  }

  const startConversation = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const signedUrl = await getSignedUrl()

      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
      if (!agentId) throw new Error('Missing ELEVENLABS agent ID in .env')

      const conversationId = await conversation.startSession({
        signedUrl,
        agentId,
        dynamicVariables: {
          user_name: userName,
        },
      })

      conversationIdRef.current = conversationId

      const insertResult = await supabase.from('conversations').insert(
        [
          {
            agent_id: agentId,
            conversation_id: conversationId,
            agent_name: 'MindAgent',
            status: 'started',
          },
        ],
        { returning: 'minimal' }
      )

      if (insertResult.error) {        console.error('❌ Failed to insert conversation:', insertResult.error)
      } else {
        const { data, error: fetchError } = await supabase
          .from('conversations')
          .select('id')
          .eq('conversation_id', conversationId)
          .single()

        if (fetchError) {
          console.error('❌ Failed to fetch conversation UUID:', fetchError)
        } else {
          dbConversationUUIDRef.current = data.id
          console.log('✅ Conversation metadata saved:', data)
        }
      }
    } catch (error) {
      console.error('❌ Failed to start conversation:', error)
    }
  }, [conversation])

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession()
    } catch (err) {
      console.error('❌ Failed to stop conversation:', err)
    }
  }, [conversation])

  return (
    <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
      {/* Status Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bricolage font-bold">
          {conversation.status === 'connected' ? 'Listening...' : 'Ready to Start'}
        </h2>
        <p className="text-gray-400">
          {conversation.status === 'connected' 
            ? 'Speak naturally, I\'m here to listen' 
            : 'Click the microphone to begin your voice journal'}
        </p>
      </div>

      {/* Microphone Button */}
      <div className="relative">
        <motion.button
          onClick={conversation.status === 'connected' ? stopConversation : startConversation}
          disabled={conversation.status === 'connecting'}
          className={cn(
            "relative p-8 rounded-full transition-all duration-300",            conversation.status === 'connected'
              ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
              : "bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/50",
            conversation.status === 'connecting' && "opacity-50 cursor-not-allowed"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {conversation.status === 'connecting' ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : conversation.status === 'connected' ? (
            <MicOff className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </motion.button>
        
        {/* Pulse Animation */}
        {conversation.status === 'connected' && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50 animation-delay-200" />
          </>
        )}
      </div>

      {/* Agent Speaking Indicator */}
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

      {/* Conversation Transcript */}
      <div className="w-full mt-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold">Conversation</h3>
        </div>
        
        <div className="bg-black/30 rounded-xl border border-white/10 p-6 max-h-[400px] overflow-y-auto">
          <AnimatePresence>            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Your conversation will appear here...
              </p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "flex",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] px-4 py-3 rounded-2xl",
                        msg.role === 'user'
                          ? "bg-indigo-500/20 text-indigo-100 border border-indigo-500/30"
                          : "bg-white/5 text-gray-300 border border-white/10"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Instructions */}
      {conversation.status !== 'connected' && (
        <div className="text-center text-sm text-gray-500 max-w-md">
          <p>
            Press the microphone to start a voice conversation. 
            Your thoughts will be transcribed and saved automatically.
          </p>
        </div>
      )}
    </div>
  )
}