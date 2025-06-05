// app/lib/db/dailySummaries.ts
import { supabase } from '../supabase';

export async function getDailySummary(userId: string, date: string) {
  const { data, error } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('date', date)
    .eq('user_id', userId)
    .single();

  // If no summary exists for this date, return null (not an error)
  if (error && error.code === 'PGRST116') {
    return null;
  }

  if (error) {
    console.error('Error fetching daily summary:', error);
    throw error;
  }

  return data;
}

export async function getAllDailySummaries(userId: string) {
  const { data, error } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching all daily summaries:', error);
    throw error;
  }

  return data || [];
}

export async function createOrUpdateDailySummary(
  userId: string,
  date: string,
  summary: string
) {
  // First check if a summary exists for this date
  const existingSummary = await getDailySummary(userId, date);

  if (existingSummary) {
    // Update existing summary
    const { data, error } = await supabase
      .from('daily_summaries')
      .update({
        summary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSummary.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating daily summary:', error);
      throw error;
    }

    return data;
  } else {
    // Create new summary
    const { data, error } = await supabase
      .from('daily_summaries')
      .insert({
        date,
        summary,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating daily summary:', error);
      throw error;
    }

    return data;
  }
}
