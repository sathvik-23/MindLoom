// app/api/debug-logs/route.ts
import { supabase } from '@/app/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  
  try {
    console.log("Debug logs API called - testing Supabase connection");
    
    // First test - get all tables
    const { data: tableList, error: tableError } = await supabase
      .from('transcripts')
      .select('created_at')
      .limit(1);
    
    if (tableError) {
      console.error("Table test error:", tableError);
      return NextResponse.json({ error: tableError.message }, { status: 500 });
    }
    
    // Test with user filtering if provided
    let transcriptsQuery = supabase.from('transcripts').select('*');
    
    if (userId) {
      transcriptsQuery = transcriptsQuery.eq('user_id', userId);
    }
    
    const { data: transcripts, error: transcriptsError } = await transcriptsQuery.limit(10);
    
    if (transcriptsError) {
      console.error("Transcripts query error:", transcriptsError);
      return NextResponse.json({ error: transcriptsError.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Database connection test successful",
      tableTest: tableList ? "passed" : "failed",
      transcriptsCount: transcripts?.length || 0,
      transcripts: transcripts || []
    });
  } catch (err) {
    console.error("Unexpected error in debug logs API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
