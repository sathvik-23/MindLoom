// app/api/debug/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    console.log("Debug API called");
    
    // Environment check
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      HAS_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      HAS_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
    
    console.log("Environment info:", envInfo);

    // Test basic connectivity
    const { data: testData, error: testError } = await supabase
      .from('transcripts')
      .select('id')
      .limit(1);

    if (testError) {
      console.error("Basic connectivity test failed:", testError);
      return NextResponse.json({ 
        error: "Database connection failed", 
        details: testError.message,
        environment: envInfo
      }, { status: 500 });
    }

    // Get user count
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id, username, full_name');

    // Get transcript count by user
    const { data: transcriptStats, error: transcriptError } = await supabase
      .from('transcripts')
      .select('user_id, created_at')
      .limit(100);

    const userStats = {};
    if (transcriptStats) {
      transcriptStats.forEach(t => {
        if (!userStats[t.user_id]) {
          userStats[t.user_id] = { count: 0, dates: new Set() };
        }
        userStats[t.user_id].count++;
        userStats[t.user_id].dates.add(new Date(t.created_at).toISOString().split('T')[0]);
      });
      
      // Convert Set to Array for JSON serialization
      Object.keys(userStats).forEach(userId => {
        userStats[userId].dates = Array.from(userStats[userId].dates);
      });
    }

    return NextResponse.json({
      success: true,
      environment: envInfo,
      database: {
        connected: true,
        users: users || [],
        userCount: users?.length || 0,
        transcriptStats,
        userStats
      }
    });

  } catch (err) {
    console.error("Debug API error:", err);
    return NextResponse.json({ 
      error: "Debug API failed", 
      details: String(err) 
    }, { status: 500 });
  }
}
