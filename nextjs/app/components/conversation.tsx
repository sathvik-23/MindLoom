'use client'

import { useConversation } from '@elevenlabs/react'
import { useCallback, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  Mic,
  MicOff,
  Loader2,
  Volume2,
  MessageCircle,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { extractGoalFromMessage, addGoal } from '../lib/goalUtils'

export function Conversation() {
  const [messages, setMessages] = useState<
    { text: string; role: 'user' | 'agent' }[]
  >([])
  const conversationIdRef = useRef<string | null>(null)
  const dbConversationUUIDRef = useRef<string | null>(null)
  const userName = 'Sathvik'
  const [status, setStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected')
  const [goalAdded, setGoalAdded] = useState<{name: string; category?: string; progress: number} | null>(null)

  // Define message type for better type safety
  interface ConversationMessage {
    message?: string;
    source?: string;
    time_in_call_secs?: number;
    [key: string]: any; // For other possible fields
  }

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Connected')
      setStatus('connected')
    },
    onDisconnect: () => {
      console.log('🛑 Disconnected')
      setStatus('disconnected')
    },
    onMessage: async (message: string | ConversationMessage) => {
      // Extract text from message - handle both string and object formats
      let messageText: string;
      let messageSource: string;
      
      if (typeof message === 'string') {
        messageText = message;
        messageSource = 'user'; // Assume user if string
      } else {
        // Handle object format
        messageText = message?.message || JSON.stringify(message);
        messageSource = message?.source === 'ai' ? 'agent' : 'user';
      }
      
      const role = messageSource === 'ai' ? 'agent' : 'user';
      setMessages((prev) => [...prev, { text: messageText, role }]);

      // Process user messages for goal requests
      if (role === 'user') {
        const goalInfo = extractGoalFromMessage(messageText)
        
        if (goalInfo.isGoalRequest && goalInfo.name) {
          try {
            // Add goal to database
            await addGoal({
              name: goalInfo.name,
              category: goalInfo.category,
              progress: goalInfo.progress || 0
            });
            
            // Set the goal added state to show confirmation
            setGoalAdded({
              name: goalInfo.name,
              category: goalInfo.category,
              progress: goalInfo.progress || 0
            });
            
            // Clear the goal added state after 5 seconds
            setTimeout(() => setGoalAdded(null), 5000);
          } catch (err) {
            console.error('Failed to add goal:', err);
          }
        }
      }

      if (!dbConversationUUIDRef.current) return;
      
      // Insert into transcripts
      await supabase.from('transcripts').insert([
        {
          conversation_id: dbConversationUUIDRef.current,
          role,
          message: messageText,
          time_in_call_secs: typeof message === 'object' ? message?.time_in_call_secs || null : null,
        },
      ]);
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
    setMessages((prev) => [...prev, { text, role: 'user' }])
    if (!dbConversationUUIDRef.current) return
    await supabase.from('transcripts').insert([
      {
        conversation_id: dbConversationUUIDRef.current,
        role: 'user',
        message: text,
        time_in_call_secs: null,
      },
    ])
  }

  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch('/api/signed-url')
    const { signedUrl } = await response.json()
    return signedUrl
  }

  const startConversation = useCallback(async () => {
    try {
      setStatus('connecting')
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const signedUrl = await getSignedUrl()

      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ''
      // Define session options type
      interface SessionOptions {
        signedUrl: string;
        agentId: string;
        dynamicVariables: Record<string, string>;
      }
      
      const conversationId = await conversation.startSession({
        signedUrl,
        agentId,
        dynamicVariables: { user_name: userName },
      } as SessionOptions)

      conversationIdRef.current = conversationId
      await supabase.from('conversations').insert([
        {
          agent_id: agentId,
          conversation_id: conversationId,
          agent_name: 'MindAgent',
          status: 'started',
        },
      ])
      const { data } = await supabase
        .from('conversations')
        .select('id')
        .eq('conversation_id', conversationId)
        .single()

      dbConversationUUIDRef.current = data?.id || null
      await logUserMessage('Hi there, just journaling my thoughts...')
    } catch (error) {
      console.error('❌ Error starting conversation:', error)
      setStatus('disconnected')
    }
  }, [conversation])

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

  return (
    <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
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
        <span className="text-gray-200">Say “goodbye” to stop recording</span>
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

      {/* Goal Added Notification */}
      <AnimatePresence>
        {goalAdded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30 flex items-start gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-300 font-medium">Goal added successfully!</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-green-200"><span className="text-green-400 font-medium">Goal:</span> {goalAdded.name}</p>
                {goalAdded.category && (
                  <p className="text-sm text-green-200"><span className="text-green-400 font-medium">Category:</span> {goalAdded.category}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-green-400 font-medium">Progress:</span>
                  <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${goalAdded.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-green-200">{goalAdded.progress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full mt-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold">Conversation</h3>
        </div>

        <div className="bg-black/30 rounded-xl border border-white/10 p-6 max-h-[400px] overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Your conversation will appear here...
              </p>
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
