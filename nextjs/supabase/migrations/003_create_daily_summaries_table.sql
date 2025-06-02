-- Create daily_summaries table for storing AI-generated summaries
CREATE TABLE IF NOT EXISTS daily_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on date to ensure one summary per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_summaries_date ON daily_summaries(date);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp on update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON daily_summaries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
