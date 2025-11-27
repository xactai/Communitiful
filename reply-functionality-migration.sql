-- Migration: Add reply_to column to messages table for reply functionality
-- Run this in your Supabase SQL Editor

-- Add reply_to column to store reply information as JSONB
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS reply_to JSONB;

-- Add index for reply_to queries (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON public.messages USING GIN (reply_to);

-- Verify the column was added
SELECT 'Reply functionality column added successfully!' as status;

