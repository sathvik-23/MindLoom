-- Add user_id column to existing tables and set up RLS policies (with policy cleanup)

-- First, enable Row Level Security on transcripts
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

-- Add user_id column to transcripts
ALTER TABLE transcripts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_transcripts_user_id ON transcripts(user_id);

-- Drop existing policy if it exists (to prevent duplicate policy errors)
DROP POLICY IF EXISTS "Users can only access their own transcripts" ON transcripts;

-- Create policy for transcripts to restrict access to user's own data
CREATE POLICY "Users can only access their own transcripts"
  ON transcripts
  FOR ALL
  USING (user_id = auth.uid());

-- Enable Row Level Security on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Add user_id column to conversations
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can only access their own conversations" ON conversations;

-- Create policy for conversations to restrict access to user's own data
CREATE POLICY "Users can only access their own conversations"
  ON conversations
  FOR ALL
  USING (user_id = auth.uid());

-- Enable Row Level Security on daily_summaries
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- Add user_id column to daily_summaries
ALTER TABLE daily_summaries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_id ON daily_summaries(user_id);

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can only access their own daily summaries" ON daily_summaries;

-- Create policy for daily_summaries to restrict access to user's own data
CREATE POLICY "Users can only access their own daily summaries"
  ON daily_summaries
  FOR ALL
  USING (user_id = auth.uid());

-- Create a profiles table to store additional user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create policy for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (id = auth.uid());

-- Create trigger to create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function for updating timestamps (create if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update the updated_at column for profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
