import { supabase } from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 2); // 2 days before today

  const { data, error } = await supabase
    .from('transcripts') // <- your actual table
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', today.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
