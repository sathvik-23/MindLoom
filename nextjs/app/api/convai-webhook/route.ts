import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event } = body;

  if (!event || !event.data) {
    return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
  }

  const {
    conversation_id,
    agent_id,
    analysis: {
      data_collection_results: {
        voice_description,
        agent_description,
      } = {},
    } = {},
    transcript,
  } = event.data;

  const { error } = await supabase.from('conversations').insert([
    {
      conversation_id,
      agent_id,
      voice_description: voice_description?.value,
      agent_description: agent_description?.value,
      transcript,
    },
  ]);

  if (error) {
    console.error('❌ Supabase insert error:', error);
    return NextResponse.json({ error: 'Failed to insert data into Supabase' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
