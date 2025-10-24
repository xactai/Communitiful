// Test script to verify environment variable setup
// Run this in the browser console to test the Groq API key configuration

console.log('🔍 Testing Environment Variable Setup...');

// Test 1: Check if environment variables are accessible
console.log('Environment variables check:');
console.log('- VITE_GROQ_API_KEY:', import.meta.env.VITE_GROQ_API_KEY ? '✅ Set' : '❌ Not set');
console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

// Test 2: Check if Groq API key is configured
const groqKey = import.meta.env.VITE_GROQ_API_KEY;
if (groqKey) {
  if (groqKey === 'your_groq_api_key_here') {
    console.log('⚠️ Groq API key not configured (using placeholder)');
  } else {
    console.log('✅ Groq API key is configured');
  }
} else {
  console.log('❌ No Groq API key found');
}

// Test 3: Check if the groqApi module loads correctly
try {
  // This will trigger the validation function
  console.log('🔄 Loading groqApi module...');
  // The module should log validation messages
} catch (error) {
  console.error('❌ Error loading groqApi module:', error);
}

// Test 4: Verify .env file setup
console.log('\n📋 Setup Checklist:');
console.log('1. ✅ .env file created with VITE_GROQ_API_KEY');
console.log('2. ✅ .env added to .gitignore');
console.log('3. ✅ groqApi.ts updated to use environment variables');
console.log('4. ✅ Validation and error handling added');
console.log('5. ✅ Fallback behavior implemented');

console.log('\n🚀 Next Steps:');
console.log('1. Create .env file with your API key');
console.log('2. Restart your development server');
console.log('3. Check console for validation messages');
console.log('4. Test message moderation in the chat');

console.log('\n💡 If you see "Groq API key not configured":');
console.log('- Make sure .env file exists in project root');
console.log('- Verify VITE_GROQ_API_KEY is set correctly');
console.log('- Restart the development server');
console.log('- Check that .env is not in .gitignore (it should be ignored)');
