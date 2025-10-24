-- Quick setup script for messages table
-- Copy and paste this into your Supabase SQL Editor

-- Step 1: Create the messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL DEFAULT 'default',
  clinic_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  author_type TEXT NOT NULL CHECK (author_type IN ('user', 'agent', 'system', 'companion')),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'allowed', 'blocked', 'flagged')),
  moderation_reason TEXT,
  companion_identity JSONB
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_clinic_id ON public.messages(clinic_id);

-- Step 3: Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a permissive policy (for development)
CREATE POLICY "Allow all operations on messages" ON public.messages
  FOR ALL USING (true);

-- Step 5: Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Step 6: Verify the table was created
SELECT 'Messages table created successfully!' as status;
