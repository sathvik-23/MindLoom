// app/api/save-transcription/route.ts

import { supabase } from '@/app/lib/supabaseClient'

export async function POST(req: Request) {
  const body = await req.json()

  const { transcript, conversation_id, role, time_in_call_secs } = body

  const { error } = await supabase.from('transcripts').insert([
    {
      message: transcript,
      conversation_id,
      role,
      time_in_call_secs,
    },
  ])

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }))
}
