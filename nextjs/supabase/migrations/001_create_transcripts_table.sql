-- Create transcripts table for storing individual conversation messages
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'agent')),
  message TEXT NOT NULL,
  time_in_call_secs FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on conversation_id for faster queries
CREATE INDEX IF NOT EXISTS idx_transcripts_conversation_id ON transcripts(conversation_id);

-- Create index on created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_transcripts_created_at ON transcripts(created_at);

-- Create conversations table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID UNIQUE NOT NULL,
  agent_id TEXT,
  voice_description TEXT,
  agent_description TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on conversation_id
CREATE INDEX IF NOT EXISTS idx_conversations_conversation_id ON conversations(conversation_id);
