// Groq API service for content moderation
// Uses Llama 3.3 70B Versatile model for moderation decisions

// Get API key from environment variables with fallback
const GROQ_API_KEY = (import.meta as any)?.env?.VITE_GROQ_API_KEY || 'your_groq_api_key_here';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Validate that the API key is available
function validateGroqApiKey(): void {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    console.warn('⚠️ Groq API key not configured. Using fallback moderation.');
  } else {
    console.log('✅ Groq API key loaded successfully');
  }
}

// Call validation on module load
validateGroqApiKey();

export interface GroqModerationResult {
  passed: boolean;
  reason?: string;
  category?: string;
}

export interface GroqModerationOptions {
  sessionId: string;
  clinicId: string;
  messageHistory?: string[];
}

/**
 * Moderates a message using Groq's Llama 3.3 70B Versatile model
 * @param message The message to moderate
 * @param options Moderation options including context
 * @returns Promise with moderation result
 */
export async function moderateWithGroq(
  message: string,
  options: GroqModerationOptions
): Promise<GroqModerationResult> {
  
  // Check if API key is available
  if (!GROQ_API_KEY || GROQ_API_KEY.includes('your_groq_api_key_here')) {
    console.warn('Groq API key not configured, skipping Groq moderation');
    return { passed: true }; // Allow message if no API key
  }

  try {
    // Create context from message history if available
    const context = options.messageHistory 
      ? `Previous messages in this chat:\n${options.messageHistory.slice(-5).join('\n')}\n\n`
      : '';
    
    // Create the prompt for Groq
    const prompt = `
${context}
You are a content moderator for a medical waiting room chat application. Your task is to determine if the following message is appropriate based on our Moderation & Safety Framework.

The chat is ONLY for companions waiting at medical facilities to share their waiting experiences. It is NOT for medical advice, personal details, or off-topic discussions.

MODERATION & SAFETY FRAMEWORK:
1. Content Filters:
   - Profanity & Hate Speech Filter
   - Harassment/Bullying Filter
   - Political/Religious Filter
   - Medical Advice Restriction

2. Context Relevance Controls:
   - Off-Topic Filter
   - Spam & Ads Detection
   - Scenario Anchoring (must relate to waiting room experiences)

3. User Behavior Moderation:
   - Anonymity with Accountability (no personal details)
   - Rate Limiting

4. Legal & Safety Safeguards:
   - Disclaimer: "This chat is for sharing experiences only, not medical advice."
   - Emergency Redirection for urgent danger mentions
   - Data Privacy (no personal details allowed)

MESSAGE TO MODERATE:
"${message}"

Respond with ONLY a JSON object with these fields:
- passed: boolean (true if message passes moderation, false if it fails)
- reason: string (explanation if failed, empty if passed)
- category: string (content_filter, context_relevance, user_behavior, safety, or empty if passed)

DO NOT include any other text in your response.
`;

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a content moderation assistant that evaluates messages for a medical waiting room chat application.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      console.error('Groq API error:', await response.text());
      // Fallback to allowing the message if API fails
      return { passed: true };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error('Invalid response from Groq API');
      return { passed: true };
    }

    try {
      // Extract JSON from response (handling potential text wrapping)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const result = JSON.parse(jsonStr);
      
      return {
        passed: result.passed,
        reason: result.reason || undefined,
        category: result.category || undefined
      };
    } catch (parseError) {
      console.error('Error parsing Groq response:', parseError);
      console.log('Raw response:', content);
      // Fallback to allowing the message if parsing fails
      return { passed: true };
    }
  } catch (error) {
    console.error('Error calling Groq API:', error);
    // Fallback to allowing the message if there's an error
    return { passed: true };
  }
}