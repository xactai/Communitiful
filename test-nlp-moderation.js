#!/usr/bin/env node

/**
 * Test script for NLP Moderation System
 * Demonstrates the new moderation capabilities
 */

import { moderateMessageNLP } from './src/lib/nlpModeration.js';

// Test cases for different moderation scenarios
const testCases = [
  // Positive messages (should be allowed)
  {
    message: "Hi everyone! I'm here waiting for my mom's surgery. How is everyone doing?",
    expected: "allow",
    description: "Friendly greeting and emotional sharing"
  },
  {
    message: "Thank you for your support. It really helps to know I'm not alone in this.",
    expected: "allow",
    description: "Grateful and supportive message"
  },
  
  // Warning messages (should warn)
  {
    message: "This is so frustrating! I've been waiting for 3 hours and no one tells us anything.",
    expected: "warn",
    description: "Frustrated but not harmful"
  },
  {
    message: "I'm really worried about my dad. The doctor said it could be serious.",
    expected: "warn",
    description: "Anxious and concerned"
  },
  {
    message: "Ugh, this is taking forever. Seriously, what's taking so long?",
    expected: "warn",
    description: "Mild frustration with intensity words"
  },
  
  // Blocked messages (should block)
  {
    message: "You're all idiots and this place sucks! I hate everyone here!",
    expected: "block",
    description: "High toxicity and harassment"
  },
  {
    message: "I want to kill myself. This is hopeless and I can't take it anymore.",
    expected: "block",
    description: "Self-harm indicators and distress"
  },
  {
    message: "You should take this medication. I recommend it because it worked for me.",
    expected: "block",
    description: "Medical advice and recommendations"
  },
  {
    message: "Vote for Trump! The liberals are destroying this country!",
    expected: "block",
    description: "Political content and divisive language"
  }
];

async function runTests() {
  console.log('🧠 Testing NLP Moderation System\n');
  console.log('=' .repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    try {
      const result = await moderateMessageNLP(testCase.message, {
        sessionId: 'test-session',
        clinicId: 'test-clinic',
        messageHistory: []
      });
      
      const success = result.action === testCase.expected;
      const status = success ? '✅ PASS' : '❌ FAIL';
      
      console.log(`\n${status} - ${testCase.description}`);
      console.log(`Message: "${testCase.message}"`);
      console.log(`Expected: ${testCase.expected}, Got: ${result.action}`);
      
      if (result.reason) {
        console.log(`Reason: ${result.reason}`);
      }
      
      if (result.suggestions && result.suggestions.length > 0) {
        console.log(`Suggestions: ${result.suggestions.join(', ')}`);
      }
      
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`Categories:`, result.categories);
      
      if (success) {
        passed++;
      } else {
        failed++;
      }
      
    } catch (error) {
      console.log(`\n❌ ERROR - ${testCase.description}`);
      console.log(`Message: "${testCase.message}"`);
      console.log(`Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! The NLP moderation system is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the moderation logic.');
  }
}

// Run the tests
runTests().catch(console.error);
