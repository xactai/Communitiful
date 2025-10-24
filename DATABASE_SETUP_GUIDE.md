# Database Setup Guide - Fix "Could not find the table 'public.messages'" Error

## 🚨 **The Problem**
You're getting the error: `"Could not find the table 'public.messages' in the schema cache"` because the database table doesn't exist yet.

## ✅ **Quick Fix - Step by Step**

### Step 1: Open Supabase Dashboard
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Database Setup Script
Copy and paste this entire script into the SQL Editor:

```sql
-- Create messages table for real-time chat
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_clinic_id ON public.messages(clinic_id);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy (for development)
CREATE POLICY "Allow all operations on messages" ON public.messages
  FOR ALL USING (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Verify the table was created
SELECT 'Messages table created successfully!' as status;
```

### Step 3: Execute the Script
1. Click the "Run" button (or press Ctrl+Enter)
2. You should see: `"Messages table created successfully!"`

### Step 4: Verify Table Creation
1. Go to "Table Editor" in the left sidebar
2. You should see a new table called "messages"
3. Click on it to verify the structure

### Step 5: Test the Chat
1. Refresh your application
2. Try sending a message
3. The error should be gone!

## 🔧 **Alternative: Use the Setup File**

If you prefer, you can also use the provided setup file:

1. Open `setup-database.sql` in your project
2. Copy the contents
3. Paste into Supabase SQL Editor
4. Run the script

## 🐛 **Troubleshooting**

### If you still get errors:

1. **Check Supabase Connection**: Make sure your Supabase URL and API key are correct in your environment variables

2. **Verify Table Exists**: In Supabase dashboard, go to Table Editor and confirm the `messages` table exists

3. **Check Real-time Settings**: In Supabase dashboard, go to Settings > API and ensure "Realtime" is enabled

4. **Clear Browser Cache**: Sometimes cached errors persist - try hard refresh (Ctrl+F5)

### Common Issues:

- **Permission Denied**: Make sure your Supabase API key has the right permissions
- **Table Already Exists**: The script uses `IF NOT EXISTS` so it's safe to run multiple times
- **Real-time Not Working**: Check that the table is added to the realtime publication

## ✅ **Success Indicators**

When everything is working correctly, you should see:

1. ✅ No more "Could not find the table" errors
2. ✅ Messages are sent successfully
3. ✅ Real-time updates work between different users
4. ✅ Console shows: "Real-time chat initialized successfully"

## 🚀 **Next Steps**

Once the database is set up:

1. Test sending messages from one browser
2. Open the app in another browser/device
3. Verify messages appear in real-time
4. Check that online user count updates correctly

The chat should now work perfectly with true multi-user real-time messaging!
