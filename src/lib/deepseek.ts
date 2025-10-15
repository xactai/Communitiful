// DeepSeek API integration for moderation and virtual agent

const DEEPSEEK_API_KEY = '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';
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ModerationResult {
  decision: 'allow' | 'block' | 'flag';
  reason?: string;
  safe_variant?: string;
}

// Advanced rule-based moderation as fallback
function advancedRuleBasedModeration(message: string): ModerationResult {
  const lowerMessage = message.toLowerCase();
  
  // Profanity and hate speech
  const profanityWords = [
    'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'crap', 'piss',
    'idiot', 'stupid', 'moron', 'retard', 'loser', 'dumbass', 'jackass'
  ];
  
  const hateTerms = [
    'hate', 'kill', 'die', 'murder', 'terrorist', 'nazi', 'racist'
  ];
  
  // Medical advice keywords  
  const medicalAdvice = [
    'take this medication', 'you should take', 'stop taking', 'increase dose',
    'decrease dose', 'medical advice', 'i recommend', 'you need to take',
    'prescription', 'diagnose', 'treatment plan'
  ];
  
  // Personal data patterns
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/;
  
  // Political/religious terms
  const politicalTerms = [
    'trump', 'biden', 'democrat', 'republican', 'liberal', 'conservative',
    'politics', 'election', 'vote', 'government'
  ];
  
  const religiousTerms = [
    'god will heal', 'pray for', 'bible says', 'jesus', 'allah', 'religious'
  ];
  
  // Check profanity
  if (profanityWords.some(word => lowerMessage.includes(word))) {
    return { 
      decision: 'block', 
      reason: 'Please keep language appropriate for all users in this healing space' 
    };
  }
  
  // Check hate speech
  if (hateTerms.some(term => lowerMessage.includes(term))) {
    return { 
      decision: 'block', 
      reason: 'Harmful language is not allowed in this supportive community' 
    };
  }
  
  // Check medical advice
  if (medicalAdvice.some(advice => lowerMessage.includes(advice))) {
    return { 
      decision: 'block', 
      reason: 'Medical advice is not allowed. Please consult with healthcare staff for medical concerns' 
    };
  }
  
  // Check personal data
  if (phonePattern.test(message) || emailPattern.test(message) || ssnPattern.test(message)) {
    return { 
      decision: 'block', 
      reason: 'Personal information is not allowed for your privacy and safety' 
    };
  }
  
  // Check political content
  if (politicalTerms.some(term => lowerMessage.includes(term))) {
    return { 
      decision: 'block', 
      reason: 'Political discussions are not appropriate in this waiting space' 
    };
  }
  
  // Check religious content  
  if (religiousTerms.some(term => lowerMessage.includes(term))) {
    return { 
      decision: 'block', 
      reason: 'Religious discussions should be kept personal in this shared space' 
    };
  }
  
  // Check message length
  if (message.trim().length === 0) {
    return { decision: 'block', reason: 'Message cannot be empty' };
  }
  
  if (message.length > 500) {
    return { decision: 'block', reason: 'Message is too long (max 500 characters)' };
  }
  
  return { decision: 'allow' };
}

export async function moderateMessage(message: string): Promise<ModerationResult> {
  // First apply rule-based moderation
  const ruleBasedResult = advancedRuleBasedModeration(message);
  if (ruleBasedResult.decision !== 'allow') {
    return ruleBasedResult;
  }

  // Try DeepSeek API for advanced moderation
  const systemPrompt = `You are a STRICT chat moderator for a hospital waiting-room companion space. Task: classify the user message. Return ONLY JSON. Rules: (1) Block profanity, hate, harassment; (2) Block politics, religion, ideology debates; (3) Block medical advice/prescriptions; (4) Block spam/ads/off-topic; (5) Block personal data sharing (phones, emails, IDs). If allowed, keep it short and supportive. Respond with JSON: {"decision":"allow|block|flag","reason":"...","safe_variant":"<optional rephrasing if minor redactions needed>"}.`;

  try {
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.log(`DeepSeek API failed (${response.status}), using rule-based moderation`);
      return ruleBasedResult;
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.log('No DeepSeek response, using rule-based moderation');
      return ruleBasedResult;
    }

    // Parse JSON response
    try {
      const result = JSON.parse(content) as ModerationResult;
      console.log('DeepSeek moderation result:', result);
      return result;
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', content);
      return ruleBasedResult;
    }
  } catch (error) {
    console.error('DeepSeek moderation error, using fallback:', error);
    return ruleBasedResult;
  }
}

// Fallback agent responses for when API fails
function getFallbackAgentResponse(trigger: string, context: string): string {
  const responses = {
    idle: [
      "How's everyone holding up? It can be tough being here for someone you care about.",
      "I hope everyone's loved ones are getting good care today.",
      "This waiting can be hard when you're here for someone important to you."
    ],
    keyword_doctor: [
      "I know waiting for updates from the doctor can feel endless. They're focused on giving your loved one the best care.",
      "The doctors here seem very thorough. It's good that your person is in capable hands.",
      "Medical teams take time because they want to be thorough with their patients."
    ],
    keyword_cost: [
      "Medical costs can add stress during an already difficult time. Have you been able to talk to someone about options?",
      "I understand financial worries on top of health concerns. Try to focus on being present for your loved one right now.",
      "Healthcare costs are overwhelming sometimes, especially when you're already worried about someone."
    ],
    keyword_waiting: [
      "Waiting is one of the hardest parts when someone you care about needs medical attention.",
      "Time feels different when you're waiting to hear about someone important to you.",
      "This kind of waiting is exhausting. You're doing something important by being here for them."
    ],
    inactivity: [
      "How's everyone doing? Being here for someone you care about can feel overwhelming.",
      "Just checking in—it's not easy being a support person during medical visits.",
      "Anyone else finding it hard to just sit and wait when someone you love needs care?"
    ],
    safety: "Please inform the hospital staff immediately if someone needs urgent help.",
    default: "Being here for someone you care about is meaningful, even when it's difficult."
  };
  
  const responseArray = responses[trigger as keyof typeof responses];
  if (Array.isArray(responseArray)) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }
  return responseArray || responses.default;
}

export async function generateAgentResponse(
  context: string,
  trigger: string
): Promise<string> {
  const systemPrompt = `You are Charlie, a supportive virtual agent for companions of patients in a medical facility.

GUIDELINES:
- Be empathetic, brief, and calming
- Never provide medical advice or personal details  
- Keep responses under 50 words
- Use warm, supportive, conversational tone
- If emergency terms appear, always redirect: "Please inform the hospital staff immediately"
- Avoid politics, religion, ideology
- Focus on emotional support for those supporting patients
- Acknowledge the stress of waiting and caring for loved ones
- Be interactive and encouraging to promote engagement

CONTEXT: You're helping companions of patients - family members, friends, and caregivers who are waiting and supporting their loved ones during medical care.`;

  const userPrompt = `Context: ${context}. Trigger reason: ${trigger}. Compose one short, warm, natural reply as Charlie aligned with the rules.`;

  try {
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      console.log(`DeepSeek API failed for agent (${response.status}), using fallback`);
      return getFallbackAgentResponse(trigger, context);
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    if (!content) {
      console.log('No DeepSeek agent response, using fallback');
      return getFallbackAgentResponse(trigger, context);
    }

    console.log('DeepSeek agent response:', content);
    return content;
  } catch (error) {
    console.error('DeepSeek agent error, using fallback:', error);
    return getFallbackAgentResponse(trigger, context);
  }
}

// Detect if message contains emergency/safety keywords
export function detectEmergencyKeywords(message: string): boolean {
  const emergencyTerms = [
    'chest pain', 'heart attack', 'stroke', 'severe bleeding', 'unconscious',
    'can\'t breathe', 'breathing problems', 'severe pain', 'emergency',
    'help me', 'dying', 'critical', 'urgent', 'ambulance', 'collapse',
    'overdose', 'suicide', 'self harm'
  ];
  
  const lowerMessage = message.toLowerCase();
  return emergencyTerms.some(term => lowerMessage.includes(term));
}

// Detect keywords for agent triggers
export function detectKeywordTriggers(message: string): string[] {
  const keywords = {
    doctor: ['doctor', 'physician', 'nurse', 'staff', 'treatment', 'appointment'],
    cost: ['cost', 'bill', 'insurance', 'payment', 'expensive', 'afford', 'money'],
    waiting: ['waiting', 'wait', 'long', 'time', 'hours', 'delay', 'when', 'slow'],
  };
  
  const lowerMessage = message.toLowerCase();
  const triggers: string[] = [];
  
  Object.entries(keywords).forEach(([category, terms]) => {
    if (terms.some(term => lowerMessage.includes(term))) {
      triggers.push(`keyword_${category}`);
    }
  });
  
  return triggers;
}