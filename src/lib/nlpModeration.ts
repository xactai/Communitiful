// NLP-based Content Moderation for Communitiful
// Advanced sentiment analysis, toxicity detection, and topic sensitivity classification
// Designed for hospital companion chatrooms with empathetic, supportive environment

export interface NLPModerationResult {
  action: 'allow' | 'warn' | 'block';
  reason?: string;
  confidence: number;
  categories: {
    sentiment: 'positive' | 'neutral' | 'negative' | 'very_negative';
    toxicity: 'none' | 'low' | 'medium' | 'high';
    topicSensitivity: 'safe' | 'sensitive' | 'triggering';
    emotionalState: 'calm' | 'stressed' | 'anxious' | 'distressed';
  };
  suggestions?: string[];
}

export interface ModerationOptions {
  sessionId: string;
  clinicId: string;
  messageHistory?: string[];
  lastMessageTimestamp?: number;
}

// Main NLP moderation function
export async function moderateMessageNLP(message: string, options: ModerationOptions): Promise<NLPModerationResult> {
  const analysis = await analyzeMessage(message, options);
  
  // Determine action based on analysis
  const action = determineAction(analysis);
  
  return {
    action,
    reason: getReason(action, analysis),
    confidence: analysis.confidence,
    categories: analysis.categories,
    suggestions: getSuggestions(action, analysis)
  };
}

// Comprehensive message analysis
async function analyzeMessage(message: string, options: ModerationOptions): Promise<{
  confidence: number;
  categories: NLPModerationResult['categories'];
}> {
  const lowerMessage = message.toLowerCase().trim();
  
  // Sentiment Analysis
  const sentiment = analyzeSentiment(lowerMessage);
  
  // Toxicity Detection
  const toxicity = detectToxicity(lowerMessage);
  
  // Topic Sensitivity Analysis
  const topicSensitivity = analyzeTopicSensitivity(lowerMessage);
  
  // Emotional State Detection
  const emotionalState = detectEmotionalState(lowerMessage, options.messageHistory || []);
  
  // Calculate overall confidence
  const confidence = calculateConfidence(sentiment, toxicity, topicSensitivity, emotionalState);
  
  return {
    confidence,
    categories: {
      sentiment,
      toxicity,
      topicSensitivity,
      emotionalState
    }
  };
}

// Sentiment Analysis - More nuanced than simple positive/negative
function analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' | 'very_negative' {
  const positiveWords = [
    'good', 'great', 'wonderful', 'amazing', 'excellent', 'fantastic', 'awesome', 'brilliant',
    'happy', 'joy', 'smile', 'laugh', 'cheerful', 'optimistic', 'hopeful', 'grateful',
    'thankful', 'blessed', 'lucky', 'fortunate', 'proud', 'excited', 'thrilled', 'delighted',
    'comfortable', 'peaceful', 'calm', 'relaxed', 'content', 'satisfied', 'pleased'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'despise', 'loathe',
    'angry', 'furious', 'rage', 'mad', 'upset', 'frustrated', 'annoyed', 'irritated',
    'sad', 'depressed', 'miserable', 'unhappy', 'gloomy', 'melancholy', 'sorrowful',
    'worried', 'anxious', 'nervous', 'scared', 'afraid', 'fearful', 'terrified', 'panic'
  ];
  
  const veryNegativeWords = [
    'hate', 'despise', 'loathe', 'disgusting', 'horrible', 'terrible', 'awful',
    'furious', 'rage', 'miserable', 'depressed', 'suicidal', 'kill', 'die', 'death',
    'hopeless', 'worthless', 'useless', 'pathetic', 'disgusting', 'revolting'
  ];
  
  const positiveCount = countWords(message, positiveWords);
  const negativeCount = countWords(message, negativeWords);
  const veryNegativeCount = countWords(message, veryNegativeWords);
  
  // Check for emotional intensity indicators
  const intensityWords = ['so', 'very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally'];
  const hasIntensity = intensityWords.some(word => message.includes(word));
  
  if (veryNegativeCount > 0 || (negativeCount > 2 && hasIntensity)) {
    return 'very_negative';
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    return 'negative';
  } else if (positiveCount > negativeCount && positiveCount > 0) {
    return 'positive';
  } else {
    return 'neutral';
  }
}

// Toxicity Detection - Multi-layered approach
function detectToxicity(message: string): 'none' | 'low' | 'medium' | 'high' {
  // High toxicity - immediate blocks
  const highToxicityPatterns = [
    // Hate speech
    /\b(nigger|faggot|retard|spic|chink|kike|wetback|towelhead|fag|dyke|tranny)\b/i,
    // Severe threats
    /\b(kill\s+yourself|kys|die\s+bitch|fuck\s+off|go\s+die|rot\s+in\s+hell)\b/i,
    // Severe harassment
    /\b(you\s+suck|you're\s+stupid|you're\s+an\s+idiot|you're\s+worthless)\b/i
  ];
  
  // Medium toxicity - warnings
  const mediumToxicityPatterns = [
    // Profanity
    /\b(fuck|shit|damn|ass|bitch|bastard|asshole|crap|piss|hell)\b/i,
    // Mild threats
    /\b(shut\s+up|get\s+lost|go\s+away|leave\s+me\s+alone)\b/i,
    // Insults
    /\b(stupid|idiot|moron|dumb|annoying|irritating)\b/i
  ];
  
  // Low toxicity - gentle warnings
  const lowToxicityPatterns = [
    // Mild frustration
    /\b(ugh|seriously|come\s+on|really|whatever|fine)\b/i,
    // Sarcasm indicators
    /\b(yeah\s+right|sure\s+thing|whatever\s+you\s+say)\b/i
  ];
  
  if (highToxicityPatterns.some(pattern => pattern.test(message))) {
    return 'high';
  } else if (mediumToxicityPatterns.some(pattern => pattern.test(message))) {
    return 'medium';
  } else if (lowToxicityPatterns.some(pattern => pattern.test(message))) {
    return 'low';
  } else {
    return 'none';
  }
}

// Topic Sensitivity Analysis
function analyzeTopicSensitivity(message: string): 'safe' | 'sensitive' | 'triggering' {
  // Triggering content - immediate blocks
  const triggeringTopics = [
    // Violence and death
    /\b(death|dying|kill|murder|suicide|self\s+harm|cut\s+myself|end\s+my\s+life)\b/i,
    // Medical emergencies
    /\b(heart\s+attack|stroke|bleeding|can't\s+breathe|overdose|emergency)\b/i,
    // Trauma triggers
    /\b(rape|abuse|violence|assault|trauma|ptsd)\b/i
  ];
  
  // Sensitive content - warnings
  const sensitiveTopics = [
    // Religion and politics
    /\b(god|jesus|allah|buddha|prayer|faith|religion|church|mosque|temple)\b/i,
    /\b(politics|election|vote|government|trump|biden|liberal|conservative)\b/i,
    // Medical advice
    /\b(you\s+should\s+take|try\s+taking|recommend|treatment|cure|remedy|diagnosis)\b/i,
    // Personal data
    /\b(my\s+name\s+is|call\s+me|my\s+number|my\s+email|my\s+address)\b/i
  ];
  
  // Safe content indicators
  const safeTopics = [
    /\b(waiting|doctor|nurse|appointment|hospital|clinic|patient|companion)\b/i,
    /\b(feeling|anxious|worried|scared|nervous|calm|relaxed|hopeful)\b/i,
    /\b(family|friend|support|help|encourage|comfort|peace)\b/i
  ];
  
  if (triggeringTopics.some(pattern => pattern.test(message))) {
    return 'triggering';
  } else if (sensitiveTopics.some(pattern => pattern.test(message))) {
    return 'sensitive';
  } else {
    return 'safe';
  }
}

// Emotional State Detection
function detectEmotionalState(message: string, messageHistory: string[]): 'calm' | 'stressed' | 'anxious' | 'distressed' {
  const distressedWords = [
    'panic', 'terrified', 'overwhelmed', 'desperate', 'hopeless', 'suicidal',
    'can\'t take it', 'breaking down', 'falling apart', 'losing it'
  ];
  
  const anxiousWords = [
    'worried', 'anxious', 'nervous', 'scared', 'afraid', 'fearful', 'concerned',
    'uneasy', 'restless', 'tense', 'jittery', 'on edge', 'stressed'
  ];
  
  const stressedWords = [
    'stressed', 'frustrated', 'annoyed', 'irritated', 'upset', 'angry',
    'tired', 'exhausted', 'overwhelmed', 'burdened', 'pressured'
  ];
  
  const calmWords = [
    'calm', 'peaceful', 'relaxed', 'content', 'comfortable', 'serene',
    'tranquil', 'at ease', 'composed', 'collected', 'centered'
  ];
  
  const distressedCount = countWords(message, distressedWords);
  const anxiousCount = countWords(message, anxiousWords);
  const stressedCount = countWords(message, stressedWords);
  const calmCount = countWords(message, calmWords);
  
  // Check message history for context
  const recentMessages = messageHistory.slice(-3);
  const hasRecentDistress = recentMessages.some(msg => 
    distressedWords.some(word => msg.toLowerCase().includes(word))
  );
  
  if (distressedCount > 0 || hasRecentDistress) {
    return 'distressed';
  } else if (anxiousCount > stressedCount && anxiousCount > calmCount) {
    return 'anxious';
  } else if (stressedCount > calmCount) {
    return 'stressed';
  } else {
    return 'calm';
  }
}

// Action determination based on analysis
function determineAction(analysis: {
  confidence: number;
  categories: NLPModerationResult['categories'];
}): 'allow' | 'warn' | 'block' {
  const { categories } = analysis;
  
  // Immediate blocks
  if (categories.toxicity === 'high' || 
      categories.topicSensitivity === 'triggering' ||
      categories.emotionalState === 'distressed') {
    return 'block';
  }
  
  // Warnings for concerning content
  if (categories.toxicity === 'medium' || 
      categories.topicSensitivity === 'sensitive' ||
      categories.sentiment === 'very_negative' ||
      categories.emotionalState === 'anxious') {
    return 'warn';
  }
  
  // Allow everything else
  return 'allow';
}

// Generate appropriate reasons
function getReason(action: 'allow' | 'warn' | 'block', analysis: {
  categories: NLPModerationResult['categories'];
}): string {
  const { categories } = analysis;
  
  if (action === 'block') {
    if (categories.toxicity === 'high') {
      return "This message contains harmful language. Let's keep our chat supportive and respectful for everyone.";
    } else if (categories.topicSensitivity === 'triggering') {
      return "This content might be triggering for others. Please consider rephrasing to be more supportive.";
    } else if (categories.emotionalState === 'distressed') {
      return "If you're in distress, please speak with hospital staff immediately. We're here to support you.";
    }
  } else if (action === 'warn') {
    if (categories.toxicity === 'medium') {
      return "This message might be hurtful. Consider a gentler way to express yourself.";
    } else if (categories.topicSensitivity === 'sensitive') {
      return "This topic might be sensitive for others. Let's keep our focus on supporting each other.";
    } else if (categories.sentiment === 'very_negative') {
      return "I understand you're going through a difficult time. Would you like to share what's on your mind in a more supportive way?";
    } else if (categories.emotionalState === 'anxious') {
      return "It sounds like you're feeling anxious. Remember, you're not alone in this waiting room.";
    }
  }
  
  return "";
}

// Generate helpful suggestions
function getSuggestions(action: 'allow' | 'warn' | 'block', analysis: {
  categories: NLPModerationResult['categories'];
}): string[] {
  const { categories } = analysis;
  const suggestions: string[] = [];
  
  if (action === 'warn') {
    if (categories.sentiment === 'negative' || categories.sentiment === 'very_negative') {
      suggestions.push("Try: 'I'm feeling worried about my loved one' instead of 'This is terrible'");
      suggestions.push("Consider: 'I hope everything goes well' to express concern positively");
    }
    
    if (categories.toxicity === 'medium') {
      suggestions.push("Try: 'I'm frustrated' instead of using strong language");
      suggestions.push("Consider: 'This is challenging' to express difficulty");
    }
    
    if (categories.emotionalState === 'anxious') {
      suggestions.push("Try: 'I'm feeling nervous about the wait' to share your feelings");
      suggestions.push("Consider: 'Does anyone else feel anxious?' to connect with others");
    }
  }
  
  if (action === 'block') {
    if (categories.toxicity === 'high') {
      suggestions.push("Try: 'I'm really upset about this situation'");
      suggestions.push("Consider: 'This is really difficult for me' to express your feelings");
    }
  }
  
  return suggestions;
}

// Helper function to count word occurrences
function countWords(message: string, words: string[]): number {
  return words.reduce((count, word) => {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = message.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

// Calculate confidence score
function calculateConfidence(
  sentiment: string,
  toxicity: string,
  topicSensitivity: string,
  emotionalState: string
): number {
  let confidence = 0.5; // Base confidence
  
  // Adjust based on clear indicators
  if (toxicity === 'high' || topicSensitivity === 'triggering') {
    confidence = 0.9;
  } else if (toxicity === 'medium' || topicSensitivity === 'sensitive') {
    confidence = 0.7;
  } else if (sentiment === 'very_negative' || emotionalState === 'distressed') {
    confidence = 0.8;
  } else if (sentiment === 'positive' && emotionalState === 'calm') {
    confidence = 0.6;
  }
  
  return Math.min(0.95, Math.max(0.1, confidence));
}

// Export the main moderation function for backward compatibility
export async function moderateMessage(message: string, options: ModerationOptions): Promise<{
  passed: boolean;
  reason?: string;
  category?: string;
}> {
  const result = await moderateMessageNLP(message, options);
  
  return {
    passed: result.action === 'allow',
    reason: result.reason,
    category: result.action === 'block' ? 'content_filter' : 
              result.action === 'warn' ? 'content_warning' : undefined
  };
}
