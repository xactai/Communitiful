-- Migration: Add reactions column to messages table for emoji reactions
-- Run this in your Supabase SQL Editor

-- Add reactions column to store reaction data as JSONB
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS reactions JSONB;

-- Add index for reactions queries (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_messages_reactions ON public.messages USING GIN (reactions);

-- Verify the column was added
SELECT 'Reactions functionality column added successfully!' as status;

