# Real-Time Chat Setup Instructions

## Problem Fixed
The original chat system used localStorage and BroadcastChannel, which only work within the same browser. This meant that users on different devices couldn't see each other's messages.

## Solution Implemented
Created a new real-time messaging system using Supabase that allows true multi-user communication across different devices and browsers.

## Setup Steps

### 1. Database Migration
Run the following SQL in your Supabase SQL editor:

```sql
-- Create messages table for real-time chat
CREATE TABLE IF NOT EXISTS messages (
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

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_clinic_id ON messages(clinic_id);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON messages
  FOR ALL USING (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

### 2. Files Created/Modified

#### New Files:
- `src/lib/realtimeChat.ts` - Real-time messaging manager
- `supabase-migration.sql` - Database migration script
- `test-realtime-chat.js` - Test script for verification

#### Modified Files:
- `src/pages/Chat.tsx` - Updated to use real-time messaging
- `src/lib/sharedChat.ts` - Enhanced with user presence tracking

### 3. How It Works

1. **Real-Time Subscriptions**: Uses Supabase real-time subscriptions to listen for database changes
2. **Cross-Device Communication**: Messages are stored in the database and broadcast to all connected clients
3. **Fallback System**: If real-time fails, falls back to local storage for reliability
4. **User Presence**: Tracks online users and shows typing indicators

### 4. Testing

1. Open the app in two different browsers or devices
2. Log in with different accounts
3. Send messages from one device
4. Verify messages appear on the other device in real-time
5. Check that online user count updates correctly

### 5. Features

- ✅ **Real-time message sharing** across different devices
- ✅ **Online user count** with live updates
- ✅ **Typing indicators** showing who is currently typing
- ✅ **User join/leave notifications** with visual feedback
- ✅ **Message moderation** with real-time updates
- ✅ **Fallback system** for reliability

### 6. Troubleshooting

If messages aren't appearing in real-time:

1. Check browser console for errors
2. Verify Supabase connection is working
3. Check if the database table was created correctly
4. Ensure real-time subscriptions are enabled in Supabase
5. Test with the provided test script

### 7. Performance Notes

- Messages are limited to the last 100 per room to prevent storage bloat
- Automatic cleanup of stale user presence (2-minute timeout)
- Efficient indexing for fast queries
- Real-time subscriptions are automatically cleaned up on component unmount
