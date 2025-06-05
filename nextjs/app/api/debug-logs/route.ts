// app/api/debug-logs/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a direct Supabase client for server-side use
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');
  
  try {
    console.log("Debug logs API called - testing Supabase connection");
    console.log("Params:", { userId, date });
    
    // Test 1: Basic connectivity - Get all tables
    const { data: tableList, error: tableError } = await supabase
      .from('transcripts')
      .select('created_at')
      .limit(1);
    
    if (tableError) {
      console.error("Table test error:", tableError);
      return NextResponse.json({ error: tableError.message }, { status: 500 });
    }
    
    // Test 2: List all transcripts (limited to 100)
    const { data: allTranscripts, error: allTranscriptsError } = await supabase
      .from('transcripts')
      .select('*')
      .limit(100);
    
    if (allTranscriptsError) {
      console.error("All transcripts query error:", allTranscriptsError);
    }
    
    // Test 3: Get user-specific transcripts
    let userQuery = supabase.from('transcripts').select('*');
    
    if (userId) {
      userQuery = userQuery.eq('user_id', userId);
    }
    
    const { data: userTranscripts, error: userTranscriptsError } = await userQuery.limit(50);
    
    if (userTranscriptsError) {
      console.error("User transcripts query error:", userTranscriptsError);
    }
    
    // Test 4: Date filtering
    let dateQuery = supabase.from('transcripts').select('*');
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      dateQuery = dateQuery
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
    }
    
    const { data: dateTranscripts, error: dateTranscriptsError } = await dateQuery.limit(50);
    
    if (dateTranscriptsError) {
      console.error("Date transcripts query error:", dateTranscriptsError);
    }
    
    // Test 5: Combined filtering
    let combinedQuery = supabase.from('transcripts').select('*');
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      combinedQuery = combinedQuery
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
    }
    
    if (userId) {
      combinedQuery = combinedQuery.eq('user_id', userId);
    }
    
    const { data: combinedTranscripts, error: combinedTranscriptsError } = await combinedQuery.limit(50);
    
    if (combinedTranscriptsError) {
      console.error("Combined query error:", combinedTranscriptsError);
    }
    
    // Get the database schema - check which tables exist
    const { data: schemaData, error: schemaError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    // Return all debug info
    return NextResponse.json({
      success: true,
      message: "Database connection tests",
      tests: {
        basicConnectivity: tableList ? "passed" : "failed",
        allTranscripts: {
          count: allTranscripts?.length || 0,
          sample: allTranscripts && allTranscripts.length > 0 ? allTranscripts[0] : null
        },
        userTranscripts: {
          count: userTranscripts?.length || 0,
          sample: userTranscripts && userTranscripts.length > 0 ? userTranscripts[0] : null
        },
        dateTranscripts: {
          count: dateTranscripts?.length || 0,
          sample: dateTranscripts && dateTranscripts.length > 0 ? dateTranscripts[0] : null
        },
        combinedTranscripts: {
          count: combinedTranscripts?.length || 0,
          sample: combinedTranscripts && combinedTranscripts.length > 0 ? combinedTranscripts[0] : null
        },
        schema: {
          tables: schemaData || [],
          error: schemaError ? schemaError.message : null
        }
      }
    });
  } catch (err) {
    console.error("Unexpected error in debug logs API:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
