// Moderation service for chat messages
// Implements content filters, context relevance controls, user behavior moderation, and safety safeguards
// Now powered by Llama 3.3 70B Versatile model via Groq API

import { moderateWithGroq, GroqModerationOptions } from './groqApi';

export interface ModerationResult {
  passed: boolean;
  reason?: string;
  category?: string;
}

export interface ModerationOptions {
  sessionId: string;
  clinicId: string;
  messageHistory?: string[];
  lastMessageTimestamp?: number;
}

// Main moderation function that runs all checks
export async function moderateMessage(message: string, options: ModerationOptions): Promise<ModerationResult> {
  // Use Groq API for moderation
  const groqOptions: GroqModerationOptions = {
    sessionId: options.sessionId,
    clinicId: options.clinicId,
    messageHistory: options.messageHistory
  };
  
  try {
    // Primary moderation using Groq's Llama 3.3 model
    const groqResult = await moderateWithGroq(message, groqOptions);
    if (!groqResult.passed) return groqResult;
    
    // Fallback to local checks if Groq passes or fails
    // Run through all moderation checks as backup
    const contentCheck = checkContentFilters(message);
    if (!contentCheck.passed) return contentCheck;

    const contextCheck = checkContextRelevance(message, options.messageHistory || []);
    if (!contextCheck.passed) return contextCheck;

    const behaviorCheck = checkUserBehavior(message, options);
    if (!behaviorCheck.passed) return behaviorCheck;

    const safetyCheck = checkSafety(message);
    if (!safetyCheck.passed) return safetyCheck;

    // All checks passed
    return { passed: true };
  } catch (error) {
    console.error('Error in moderation:', error);
    // Fallback to local checks if Groq fails
    
    const contentCheck = checkContentFilters(message);
    if (!contentCheck.passed) return contentCheck;

    const contextCheck = checkContextRelevance(message, options.messageHistory || []);
    if (!contextCheck.passed) return contextCheck;

    const behaviorCheck = checkUserBehavior(message, options);
    if (!behaviorCheck.passed) return behaviorCheck;

    const safetyCheck = checkSafety(message);
    if (!safetyCheck.passed) return safetyCheck;

    // All checks passed
    return { passed: true };
  }
}

// Content Filters - More empathetic approach
export function checkContentFilters(message: string): ModerationResult {
  // Still block profanity and hate speech
  if (containsProfanityOrHateSpeech(message)) {
    return {
      passed: false,
      reason: "Please keep the conversation friendly and respectful",
      category: "content_filter"
    };
  }

  // Still block severe harassment or bullying
  if (containsHarassmentOrBullying(message)) {
    return {
      passed: false,
      reason: "Let's maintain a supportive environment for everyone",
      category: "content_filter"
    };
  }

  // Only block explicit political propaganda or religious preaching
  if (containsPoliticalOrReligiousContent(message)) {
    return {
      passed: false,
      reason: "Let's keep our chat focused on supporting each other",
      category: "content_filter"
    };
  }

  // Still block medical advice but with a more helpful message
  if (containsMedicalAdvice(message)) {
    return {
      passed: false,
      reason: "For medical questions, please speak with your healthcare provider",
      category: "content_filter"
    };
  }

  return { passed: true };
}

// Context Relevance Controls - More permissive for casual conversations
export function checkContextRelevance(message: string, messageHistory: string[]): ModerationResult {
  // Allow casual conversations and greetings
  if (isCasualConversation(message)) {
    return { passed: true };
  }
  
  // Still block spam and ads
  if (isSpamOrAd(message)) {
    return {
      passed: false,
      reason: "Message appears to be spam or advertisement",
      category: "context_relevance"
    };
  }
  
  // More permissive off-topic check - only block extreme cases
  if (isExtremelyOffTopic(message, messageHistory)) {
    return {
      passed: false,
      reason: "Message is extremely off-topic for a companion chat",
      category: "context_relevance"
    };
  }

  return { passed: true };
}

// User Behavior Moderation - Allow emotional sharing
export function checkUserBehavior(message: string, options: ModerationOptions): ModerationResult {
  // Redact personal identifiers but don't block the message
  if (containsPersonalDetails(message)) {
    // In a real implementation, we would redact the personal details here
    // For now, we'll just pass the message through
    return { passed: true };
  }

  // Light rate limiting - only block if sending too many messages in a short time
  if (options.lastMessageTimestamp && 
      Date.now() - options.lastMessageTimestamp < 500) { // 500ms between messages
    return {
      passed: false,
      reason: "Please slow down a bit so everyone can read your messages",
      category: "user_behavior"
    };
  }

  return { passed: true };
}

// Legal & Safety Safeguards - Allow emotional sharing but flag emergencies
export function checkSafety(message: string): ModerationResult {
  // Check for self-harm or emergency indicators but don't block
  // Instead, we'll handle this with a safety alert in the UI
  if (containsSelfHarmIndicators(message)) {
    // We'll pass the message but mark it for special handling
    return {
      passed: true,
      reason: "SAFETY_ALERT: Please contact healthcare professionals if you're having thoughts of self-harm",
      category: "safety_alert"
    };
  }

  if (containsUrgentDanger(message)) {
    // We'll pass the message but mark it for special handling
    return {
      passed: true,
      reason: "SAFETY_ALERT: If this is urgent, please inform the hospital staff right away",
      category: "safety_alert"
    };
  }

  // Allow personal emotional sharing
  if (containsEmotionalSharing(message)) {
    return { passed: true };
  }

  // Still check for personal data that could compromise privacy
  if (containsPersonalData(message)) {
    // In a real implementation, we would redact the personal data
    // For now, we'll just pass the message through
    return { passed: true };
  }

  return { passed: true };
}

// Helper functions for content filtering
function containsProfanityOrHateSpeech(message: string): boolean {
  const profanityList = ['fuck', 'shit', 'ass', 'bitch', 'damn', 'cunt', 'dick', 'bastard', 'asshole'];
  const hateSpeechTerms = ['nigger', 'faggot', 'retard', 'spic', 'chink', 'kike', 'wetback', 'towelhead'];
  
  const lowerMessage = message.toLowerCase();
  return profanityList.some(word => {
    // Check for whole words to avoid false positives
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerMessage);
  }) || hateSpeechTerms.some(word => lowerMessage.includes(word));
}

function containsHarassmentOrBullying(message: string): boolean {
  // Focus only on severe bullying terms, allow mild criticism
  const severeBullyingTerms = ['kill yourself', 'kys', 'die', 'hate you'];
  
  const lowerMessage = message.toLowerCase();
  return severeBullyingTerms.some(word => lowerMessage.includes(word));
}

function containsPoliticalOrReligiousContent(message: string): boolean {
  // Only block explicit political propaganda or religious preaching
  const politicalPropagandaTerms = ['vote for', 'support the', 'against the', 'liberal agenda', 'conservative agenda'];
  const religiousPreachingTerms = ['you should believe', 'convert to', 'sinners will', 'only path to'];
  
  const lowerMessage = message.toLowerCase();
  return politicalPropagandaTerms.some(word => lowerMessage.includes(word)) || 
         religiousPreachingTerms.some(word => lowerMessage.includes(word));
}

// New helper functions for the empathetic moderation system
function isCasualConversation(message: string): boolean {
  const casualPhrases = [
    'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
    'how are you', 'how\'s it going', 'what\'s up', 'feeling', 'better',
    'thanks', 'thank you', 'nice', 'great', 'awesome', 'cool', 'food',
    'movie', 'show', 'watch', 'sleep', 'rest', 'tired', 'happy', 'sad',
    'excited', 'bored', 'hungry', 'thirsty', 'weather', 'today', 'yesterday',
    'tomorrow', 'weekend', 'week', 'day', 'night', 'morning', 'evening'
  ];
  
  const lowerMessage = message.toLowerCase();
  return casualPhrases.some(phrase => lowerMessage.includes(phrase));
}

function isExtremelyOffTopic(message: string, messageHistory: string[]): boolean {
  // Only block content that's completely unrelated to a hospital waiting room context
  // or casual conversation between companions
  const extremelyOffTopicTerms = [
    'buy now', 'discount', 'offer', 'sale', 'click here', 'earn money',
    'investment opportunity', 'cryptocurrency', 'bitcoin', 'ethereum',
    'make money fast', 'get rich', 'lottery', 'casino', 'gambling'
  ];
  
  const lowerMessage = message.toLowerCase();
  return extremelyOffTopicTerms.some(term => lowerMessage.includes(term));
}

function containsEmotionalSharing(message: string): boolean {
  const emotionalTerms = [
    'feel', 'feeling', 'scared', 'afraid', 'anxious', 'worried', 'nervous',
    'sad', 'depressed', 'upset', 'angry', 'frustrated', 'annoyed', 'tired',
    'exhausted', 'pain', 'hurt', 'suffering', 'lonely', 'alone', 'miss',
    'hope', 'wish', 'dream', 'happy', 'excited', 'grateful', 'thankful'
  ];
  
  const lowerMessage = message.toLowerCase();
  return emotionalTerms.some(term => lowerMessage.includes(term));
}

function containsSelfHarmIndicators(message: string): boolean {
  const selfHarmTerms = [
    'kill myself', 'suicide', 'end my life', 'don\'t want to live',
    'want to die', 'harm myself', 'hurt myself', 'self harm', 'cut myself'
  ];
  
  const lowerMessage = message.toLowerCase();
  return selfHarmTerms.some(term => lowerMessage.includes(term));
}

function containsMedicalAdvice(message: string): boolean {
  const medicalAdviceTerms = ['you should take', 'try taking', 'should ask for', 'recommend', 'treatment', 'cure', 'remedy', 'diagnosis', 'prescribe', 'medication'];
  
  const lowerMessage = message.toLowerCase();
  return medicalAdviceTerms.some(phrase => lowerMessage.includes(phrase));
}

// Helper functions for context relevance
function isOffTopic(message: string, messageHistory: string[]): boolean {
  // This is a simplified implementation
  const waitingRoomTopics = ['wait', 'waiting', 'doctor', 'nurse', 'appointment', 'clinic', 'hospital', 'patient', 'treatment', 'feeling'];
  
  const lowerMessage = message.toLowerCase();
  const isRelevant = waitingRoomTopics.some(topic => lowerMessage.includes(topic));
  
  // If the message is very short, don't flag as off-topic
  if (message.length < 10) return false;
  
  // If message history is empty, be more lenient
  if (messageHistory.length === 0) return false;
  
  return !isRelevant;
}

function isSpamOrAd(message: string): boolean {
  // Check for repeated text
  const words = message.split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 10 && uniqueWords.size < words.length * 0.5) {
    return true;
  }
  
  // Check for links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (message.match(urlRegex)) {
    return true;
  }
  
  // Check for common ad phrases
  const adPhrases = ['buy now', 'limited time', 'discount', 'offer', 'click here', 'sale', 'free', 'earn money', 'best price'];
  const lowerMessage = message.toLowerCase();
  return adPhrases.some(phrase => lowerMessage.includes(phrase));
}

function isContextuallyRelevant(message: string, messageHistory: string[]): boolean {
  // This is a simplified implementation
  // In a real system, this would use more sophisticated NLP techniques
  return !isOffTopic(message, messageHistory);
}

// Helper functions for user behavior
function containsPersonalDetails(message: string): boolean {
  // Check for phone numbers
  const phoneRegex = /(\+\d{1,3}[\s-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
  if (message.match(phoneRegex)) {
    return true;
  }
  
  // Check for email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  if (message.match(emailRegex)) {
    return true;
  }
  
  // Check for common personal identifiers
  const personalIdentifiers = ['my name is', 'i am', 'i\'m', 'call me', 'my number is', 'my email is', 'my address is', 'i live at', 'my birthday is'];
  const lowerMessage = message.toLowerCase();
  return personalIdentifiers.some(phrase => lowerMessage.includes(phrase));
}

// Helper functions for safety
function containsUrgentDanger(message: string): boolean {
  const dangerTerms = ['emergency', 'help me', 'dying', 'suicide', 'kill myself', 'heart attack', 'stroke', 'bleeding', 'can\'t breathe', 'overdose'];
  
  const lowerMessage = message.toLowerCase();
  return dangerTerms.some(term => lowerMessage.includes(term));
}

function containsPersonalData(message: string): boolean {
  // This is similar to containsPersonalDetails but could be expanded
  return containsPersonalDetails(message);
}