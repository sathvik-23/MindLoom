// app/lib/db/transcripts.ts
import { supabase } from '../supabase';

export async function getTranscripts(userId: string, conversationId: string) {
  const { data, error } = await supabase
    .from('transcripts')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching transcripts:', error);
    throw error;
  }

  return data || [];
}

export async function createTranscript(
  userId: string,
  conversationId: string,
  role: 'user' | 'agent',
  message: string,
  timeInCallSecs?: number
) {
  const { data, error } = await supabase
    .from('transcripts')
    .insert({
      conversation_id: conversationId,
      role,
      message,
      time_in_call_secs: timeInCallSecs,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating transcript:', error);
    throw error;
  }

  return data;
}

export async function getConversationsByDate(userId: string, date: string) {
  // Get start and end of the day
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      transcripts:transcripts(*)
    `)
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations by date:', error);
    throw error;
  }

  return data || [];
}

export async function getAllConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all conversations:', error);
    throw error;
  }

  return data || [];
}

export async function createConversation(
  userId: string,
  conversationId: string,
  agentId?: string,
  voiceDescription?: string,
  agentDescription?: string
) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      conversation_id: conversationId,
      agent_id: agentId,
      voice_description: voiceDescription,
      agent_description: agentDescription,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }

  return data;
}
