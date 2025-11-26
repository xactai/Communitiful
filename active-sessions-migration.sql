-- Create active_sessions table for single active session enforcement
-- This table tracks active sessions by mobile number to prevent multiple simultaneous logins

CREATE TABLE IF NOT EXISTS public.active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_active_sessions_mobile_number ON public.active_sessions(mobile_number);
CREATE INDEX IF NOT EXISTS idx_active_sessions_session_id ON public.active_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_is_active ON public.active_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_active_sessions_mobile_active ON public.active_sessions(mobile_number, is_active);

-- Enable Row Level Security
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now - can be made more restrictive later)
CREATE POLICY "Allow all operations on active_sessions" ON public.active_sessions
  FOR ALL USING (true);

-- Optional: Create a function to automatically clean up old inactive sessions (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.active_sessions
  WHERE is_active = false 
    AND last_seen_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Verify the table was created
SELECT 'Active sessions table created successfully!' as status;

