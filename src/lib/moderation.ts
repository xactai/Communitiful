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

// Content Filters
export function checkContentFilters(message: string): ModerationResult {
  if (containsProfanityOrHateSpeech(message)) {
    return {
      passed: false,
      reason: "Message contains inappropriate language",
      category: "content_filter"
    };
  }

  if (containsHarassmentOrBullying(message)) {
    return {
      passed: false,
      reason: "Message contains harassment or bullying language",
      category: "content_filter"
    };
  }

  if (containsPoliticalOrReligiousContent(message)) {
    return {
      passed: false,
      reason: "Message contains political or religious content",
      category: "content_filter"
    };
  }

  if (containsMedicalAdvice(message)) {
    return {
      passed: false,
      reason: "Message appears to contain medical advice",
      category: "content_filter"
    };
  }

  return { passed: true };
}

// Context Relevance Controls
export function checkContextRelevance(message: string, messageHistory: string[]): ModerationResult {
  if (isOffTopic(message, messageHistory)) {
    return {
      passed: false,
      reason: "Message appears to be off-topic",
      category: "context_relevance"
    };
  }

  if (isSpamOrAd(message)) {
    return {
      passed: false,
      reason: "Message appears to be spam or advertisement",
      category: "context_relevance"
    };
  }

  if (!isContextuallyRelevant(message, messageHistory)) {
    return {
      passed: false,
      reason: "Message is not contextually relevant to waiting room experience",
      category: "context_relevance"
    };
  }

  return { passed: true };
}

// User Behavior Moderation
export function checkUserBehavior(message: string, options: ModerationOptions): ModerationResult {
  if (containsPersonalDetails(message)) {
    return {
      passed: false,
      reason: "Message contains personal details",
      category: "user_behavior"
    };
  }

  // Rate limiting check would be implemented here
  // This would use the options.lastMessageTimestamp and current time

  return { passed: true };
}

// Legal & Safety Safeguards
export function checkSafety(message: string): ModerationResult {
  if (containsUrgentDanger(message)) {
    return {
      passed: false,
      reason: "Message indicates urgent danger - please contact staff immediately",
      category: "safety"
    };
  }

  if (containsPersonalData(message)) {
    return {
      passed: false,
      reason: "Message contains personal data",
      category: "safety"
    };
  }

  return { passed: true };
}

// Helper functions for content filtering
function containsProfanityOrHateSpeech(message: string): boolean {
  const profanityList = ['fuck', 'shit', 'ass', 'bitch', 'damn', 'cunt', 'dick', 'bastard', 'asshole'];
  const hateSpeechTerms = ['nigger', 'faggot', 'retard', 'spic', 'chink', 'kike', 'wetback', 'towelhead'];
  
  const lowerMessage = message.toLowerCase();
  return profanityList.some(word => lowerMessage.includes(word)) || 
         hateSpeechTerms.some(word => lowerMessage.includes(word));
}

function containsHarassmentOrBullying(message: string): boolean {
  const bullyingTerms = ['stupid', 'idiot', 'loser', 'ugly', 'fat', 'dumb', 'kill yourself', 'kys', 'die'];
  
  const lowerMessage = message.toLowerCase();
  return bullyingTerms.some(word => lowerMessage.includes(word));
}

function containsPoliticalOrReligiousContent(message: string): boolean {
  const politicalTerms = ['democrat', 'republican', 'liberal', 'conservative', 'trump', 'biden', 'election', 'vote', 'congress', 'senate'];
  const religiousTerms = ['god', 'jesus', 'allah', 'bible', 'quran', 'church', 'mosque', 'temple', 'pray', 'sin', 'heaven', 'hell'];
  
  const lowerMessage = message.toLowerCase();
  return politicalTerms.some(word => lowerMessage.includes(word)) || 
         religiousTerms.some(word => lowerMessage.includes(word));
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