// Test script to verify real-time messaging functionality
// Run this in the browser console to test message sharing

console.log('Testing real-time chat functionality...');

// Test 1: Check if realtimeChat is available
if (typeof window.realtimeChat !== 'undefined') {
  console.log('✅ RealtimeChat is available');
} else {
  console.log('❌ RealtimeChat is not available');
}

// Test 2: Check if Supabase client is available
if (typeof window.supabase !== 'undefined') {
  console.log('✅ Supabase client is available');
} else {
  console.log('❌ Supabase client is not available');
}

// Test 3: Test message sending
async function testMessageSending() {
  try {
    const testMessage = {
      id: crypto.randomUUID(),
      clinicId: 'test-clinic-1',
      sessionId: 'test-session-' + Date.now(),
      authorType: 'user',
      text: 'Test message from browser console',
      createdAt: new Date(),
      moderation: { status: 'allowed' }
    };
    
    await window.realtimeChat.addMessage(testMessage);
    console.log('✅ Test message sent successfully');
  } catch (error) {
    console.error('❌ Failed to send test message:', error);
  }
}

// Test 4: Test message subscription
function testMessageSubscription() {
  const unsubscribe = window.realtimeChat.subscribe((messages) => {
    console.log('📨 Received messages:', messages.length);
    const latestMessage = messages[messages.length - 1];
    if (latestMessage) {
      console.log('Latest message:', latestMessage.text);
    }
  });
  
  console.log('✅ Message subscription active');
  
  // Cleanup after 10 seconds
  setTimeout(() => {
    unsubscribe();
    console.log('🔌 Message subscription cleaned up');
  }, 10000);
}

// Run tests
console.log('Starting real-time chat tests...');
testMessageSubscription();
setTimeout(testMessageSending, 2000);

console.log('Test instructions:');
console.log('1. Open this page in another browser/device');
console.log('2. Send a message from the other device');
console.log('3. Check if the message appears here in real-time');
console.log('4. Send a message from here and check if it appears on the other device');
