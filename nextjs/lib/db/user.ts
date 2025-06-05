// lib/db/user.ts
import { supabase } from '@/app/lib/supabase/client';

/**
 * Get a user's profile data
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
}

/**
 * Update a user's profile data
 */
export async function updateUserProfile(
  userId: string, 
  updates: { 
    username?: string;
    full_name?: string;
    avatar_url?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
}

/**
 * Create a new transcript with the given user ID
 */
export async function createTranscript(
  userId: string,
  conversationId: string,
  role: 'user' | 'agent',
  message: string,
  timeInCallSecs?: number
) {
  try {
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
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating transcript:', error);
    return { data: null, error };
  }
}

/**
 * Get transcripts for a specific conversation with user ID
 */
export async function getTranscripts(userId: string, conversationId: string) {
  try {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    return { data: null, error };
  }
}

/**
 * Get daily summaries for a specific user
 */
export async function getDailySummary(userId: string, date: string) {
  try {
    const { data, error } = await supabase
      .from('daily_summaries')
      .select('*')
      .eq('date', date)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    return { data: null, error };
  }
}

/**
 * Create or update a daily summary
 */
export async function createOrUpdateDailySummary(
  userId: string,
  date: string,
  summary: string
) {
  try {
    const { data, error } = await supabase
      .from('daily_summaries')
      .upsert({
        user_id: userId,
        date,
        summary,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id, date'
      });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating/updating daily summary:', error);
    return { data: null, error };
  }
}
