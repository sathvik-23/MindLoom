// app/api/daily-logs/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role key to bypass RLS
// Fallback to anon key if service role key is not available
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Also create a client with anon key for fallback
const anonSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const userId = searchParams.get('userId');

  console.log("API Request:", { date, userId, url: request.url });
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Service role key available:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

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
    
    // First, let's check if there are any records for this user at all
    const { data: allUserData, error: allUserError } = await supabase
      .from('transcripts')
      .select('id, created_at, role')
      .eq('user_id', userId)
      .limit(10);

    console.log(`Total records for user: ${allUserData?.length || 0}`);
    if (allUserData && allUserData.length > 0) {
      console.log("Sample user records:", allUserData.map(r => ({
        id: r.id,
        created_at: r.created_at,
        date: new Date(r.created_at).toISOString().split('T')[0]
      })));
    }

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
      
      // If we get a permission error, try with anon client
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log("Trying with anon client due to permission error...");
        
        const { data: anonData, error: anonError } = await anonSupabase
          .from('transcripts')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay)
          .order('created_at', { ascending: true });
        
        if (anonError) {
          console.error("Anon query also failed:", anonError);
          return NextResponse.json({ error: anonError.message }, { status: 500 });
        }
        
        return NextResponse.json(anonData || []);
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Successfully found ${data?.length || 0} records for date ${dateOnly}`);
    
    if (data && data.length > 0) {
      console.log("First record sample:", {
        id: data[0].id,
        role: data[0].role,
        created_at: data[0].created_at,
        message_preview: data[0].message.substring(0, 100)
      });
    } else {
      // If no records found for the specific date, try a broader search
      console.log("No records found for specific date, trying broader search...");
      
      const { data: broadData, error: broadError } = await supabase
        .from('transcripts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (broadData && broadData.length > 0) {
        console.log("Recent records for user:", broadData.map(r => ({
          date: new Date(r.created_at).toISOString().split('T')[0],
          role: r.role,
          created_at: r.created_at
        })));
      }
    }
    
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Unexpected error in daily-logs API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}