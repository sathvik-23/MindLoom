'use client'

import { useConversation } from '@elevenlabs/react'
import { useCallback, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function Conversation() {
  const [messages, setMessages] = useState<string[]>([])
  const conversationIdRef = useRef<string | null>(null)
  const dbConversationUUIDRef = useRef<string | null>(null)
  const userName = 'Sathvik'

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Connected')
      setMessages((prev) => [...prev, '[Connected]'])
    },
    onDisconnect: () => {
      console.log('❌ Disconnected')
      setMessages((prev) => [...prev, '[Disconnected]'])
    },
    onMessage: async (message: {
      text?: string
      source?: string
      time_in_call_secs?: number
    }) => {
      console.log('📨 Message:', message)

      const text = message?.text || JSON.stringify(message)
      const role = message?.source === 'ai' ? 'agent' : 'user'

      setMessages((prev) => [...prev, text])

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
        console.error('❌ Supabase insert error:', error)
      } else {
        console.log('✅ Transcript saved')
      }
    },
    onError: (error: any) => {
      console.error('🚨 Error:', error)
      setMessages((prev) => [...prev, `[Error] ${error.message}`])
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

      if (insertResult.error) {
        console.error('❌ Failed to insert conversation:', insertResult.error)
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
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === 'connected'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
      </div>

      <div className="mt-4 w-full max-w-lg bg-gray-100 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Conversation Transcript</h3>
        <ul className="space-y-1 text-sm max-h-[300px] overflow-auto">
          {messages.map((msg, idx) => (
            <li
              key={idx}
              className="bg-white p-2 rounded shadow-sm font-mono whitespace-pre-wrap break-words"
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
