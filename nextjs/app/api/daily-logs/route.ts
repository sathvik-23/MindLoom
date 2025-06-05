// app/api/daily-logs/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const userId = searchParams.get('userId');

  console.log("API Request:", { date, userId, url: request.url });
  console.log("Request headers:", Object.fromEntries(request.headers.entries()));

  if (!date) {
    console.error("Missing date parameter");
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  if (!userId) {
    console.error("Missing userId parameter");
    return NextResponse.json({ error: 'User ID parameter is required' }, { status: 400 });
  }

  try {
    // Format the date to just YYYY-MM-DD
    const dateOnly = date.split('T')[0]; 
    
    console.log(`Fetching transcripts for date: ${dateOnly}, user: ${userId}`);
    
    // Use date range filtering which works reliably
    const startOfDay = `${dateOnly}T00:00:00.000Z`;
    const endOfDay = `${dateOnly}T23:59:59.999Z`;
    
    console.log(`Date range: ${startOfDay} to ${endOfDay}`);
    
    const { data, error } = await supabase
      .from('transcripts')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Successfully found ${data?.length || 0} records`);
    
    if (data && data.length > 0) {
      console.log("First record sample:", {
        id: data[0].id,
        role: data[0].role,
        created_at: data[0].created_at,
        message_preview: data[0].message.substring(0, 100)
      });
    }
    
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Unexpected error in daily-logs API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}