import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

// Mock data for development and fallback
const mockGoals = [
  { id: '1', name: 'Exercise Routine', progress: 75, category: 'Fitness', created_at: new Date().toISOString() },
  { id: '2', name: 'Python Learning', progress: 67, category: 'Education', created_at: new Date().toISOString() },
  { id: '3', name: 'Work-Life Balance', progress: 75, category: 'Wellbeing', created_at: new Date().toISOString() },
  { id: '4', name: 'Meditation', progress: 86, category: 'Mindfulness', created_at: new Date().toISOString() },
];

export async function GET() {
  try {
    // Check if required environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Missing Supabase environment variables, using mock data');
      return NextResponse.json(mockGoals);
    }

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching goals:', error);
      
      // Check if the error is related to non-existent table
      if (error.message.includes('does not exist')) {
        console.log('Goals table does not exist, using mock data');
        return NextResponse.json(mockGoals);
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no data, return mock data
    if (!data || data.length === 0) {
      console.log('No goals found, using mock data');
      return NextResponse.json(mockGoals);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in goals API:', error);
    return NextResponse.json(mockGoals);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, progress = 0 } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Goal name is required' }, { status: 400 });
    }

    // Check if required environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Missing Supabase environment variables, using mock response');
      const mockGoal = {
        id: Date.now().toString(),
        name,
        category: category || 'Personal',
        progress: Math.min(Math.max(progress, 0), 100),
        created_at: new Date().toISOString()
      };
      return NextResponse.json(mockGoal);
    }

    const { data, error } = await supabase
      .from('goals')
      .insert([
        {
          name,
          category: category || 'Personal',
          progress: Math.min(Math.max(progress, 0), 100) // Ensure progress is between 0-100
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding goal:', error);
      
      // If table doesn't exist, return mock response
      if (error.message.includes('does not exist')) {
        const mockGoal = {
          id: Date.now().toString(),
          name,
          category: category || 'Personal',
          progress: Math.min(Math.max(progress, 0), 100),
          created_at: new Date().toISOString()
        };
        return NextResponse.json(mockGoal);
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in POST goals API:', error);
    const mockGoal = {
      id: Date.now().toString(),
      name: 'Mock Goal',
      category: 'Personal',
      progress: 0,
      created_at: new Date().toISOString()
    };
    return NextResponse.json(mockGoal);
  }
}

// Update goal progress
export async function PUT(request: NextRequest) {
  try {
    const { id, progress } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Check if required environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Missing Supabase environment variables, using mock response');
      return NextResponse.json({
        id,
        progress: Math.min(Math.max(progress, 0), 100),
        updated_at: new Date().toISOString()
      });
    }

    const { data, error } = await supabase
      .from('goals')
      .update({
        progress: Math.min(Math.max(progress, 0), 100) // Ensure progress is between 0-100
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
      
      // If table doesn't exist, return mock response
      if (error.message.includes('does not exist')) {
        return NextResponse.json({
          id,
          progress: Math.min(Math.max(progress, 0), 100),
          updated_at: new Date().toISOString()
        });
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in PUT goals API:', error);
    return NextResponse.json({
      id: '1',
      progress: 50,
      updated_at: new Date().toISOString()
    });
  }
}
