-- Create RPC function to get transcripts for a specific date and user
CREATE OR REPLACE FUNCTION get_transcripts_for_date(
  user_id_param UUID,
  date_param TEXT
)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  role TEXT,
  message TEXT,
  time_in_call_secs FLOAT,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.conversation_id,
    t.role,
    t.message,
    t.time_in_call_secs,
    t.created_at,
    t.user_id
  FROM transcripts t
  WHERE t.user_id = user_id_param
    AND DATE(t.created_at) = DATE(date_param::date)
  ORDER BY t.created_at ASC;
END;
$$;

-- Grant permission to authenticated users to execute this function
GRANT EXECUTE ON FUNCTION get_transcripts_for_date(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_transcripts_for_date(UUID, TEXT) TO anon;

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
