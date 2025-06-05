import { supabase } from '@/app/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const userId = searchParams.get('userId');

  // Add debug logs
  console.log("Daily logs API called with:");
  console.log("- Date:", date);
  console.log("- User ID:", userId);

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);
  
  console.log("- Date range:", startDate.toISOString(), "to", endDate.toISOString());

  try {
    // Create the query with date filtering
    let query = supabase
      .from('transcripts')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString());
    
    // Add user filtering if userId is provided
    if (userId) {
      query = query.eq('user_id', userId);
      console.log("- Filtering by user_id:", userId);
    }
    
    // Execute the query with ordering
    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error("- Query error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("- Returned logs count:", data?.length || 0);
    
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("- Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
