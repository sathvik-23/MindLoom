import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');

  console.log('Daily summary requested for date:', date);

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
  }

  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);

  const { data: transcripts, error } = await supabase
    .from('transcripts')
    .select('message, role')
    .gte('created_at', startDate.toISOString())
    .lt('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  console.log('Transcripts fetched:', transcripts?.length || 0);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!transcripts || transcripts.length === 0) {
    return NextResponse.json({ summary: 'No conversations found for this date.' });
  }

  const messages = transcripts.map((t) => {
    // Parse message if it's JSON
    let messageText = t.message;
    try {
      const parsed = JSON.parse(t.message);
      if (parsed.message) messageText = parsed.message;
      else if (parsed.text) messageText = parsed.text;
    } catch {
      // Not JSON, use as is
    }
    
    const role = t.role === 'user' ? 'User' : 'AI';
    return `${role}: ${messageText}`;
  }).join('\n');

  console.log('Message length:', messages.length);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const prompt = `
    Please provide a concise summary of the following conversation. Format your response with clear sections using **Section Headers** and bullet points where appropriate.
    
    Include these sections if relevant:
    - **Key Topics**: Main subjects discussed
    - **Insights**: Important realizations or thoughts
    - **Emotions**: Emotional tone or feelings expressed
    - **Action Items**: Any goals or next steps mentioned
    
    Conversation:
    ${messages}
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();
    
    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error('Error generating summary:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    
    // Return a basic summary if Gemini fails
    const basicSummary = `**Conversation Overview**

This conversation contains ${transcripts.length} messages between the user and AI assistant.

**Unable to generate detailed summary**
The AI summary service is temporarily unavailable. The conversation appears to include introductions and general discussion.

**Messages**: ${transcripts.length} total
**Date**: ${date}`;
    
    return NextResponse.json({ 
      summary: basicSummary,
      error: 'Using fallback summary due to AI service error'
    });
  }
}
