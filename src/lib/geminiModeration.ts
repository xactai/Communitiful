// Gemini API based moderation for chat messages
// Ensures harmful or irrelevant content is blocked before posting

export interface GeminiModerationOptions {
  sessionId?: string;
  clinicId?: string;
  messageHistory?: string[];
}

export interface GeminiModerationResult {
  allowed: boolean;
  reason?: string;
  category?: string;
  rawResponse?: unknown;
}

const DEFAULT_GEMINI_API_KEY = 'AIzaSyD70WvSe63OIdLjX55_w0RYkiXPEd7XrVA';
const GEMINI_API_KEY =
  (import.meta as any)?.env?.VITE_GEMINI_API_KEY ||
  (typeof process !== 'undefined' ? process.env?.VITE_GEMINI_API_KEY : undefined) ||
  DEFAULT_GEMINI_API_KEY;

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function moderateWithGemini(
  message: string,
  options: GeminiModerationOptions = {}
): Promise<GeminiModerationResult> {
  if (!message.trim()) {
    return { allowed: true };
  }

  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key missing. Skipping Gemini moderation.');
    return { allowed: true };
  }

  const contextSummary = [
    options.sessionId ? `Session ID: ${options.sessionId}` : null,
    options.clinicId ? `Clinic ID: ${options.clinicId}` : null,
    options.messageHistory && options.messageHistory.length
      ? `Recent chat:\n${options.messageHistory.slice(-5).join('\n')}`
      : null
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `
You are moderating a live chat between companions waiting in a hospital lobby.
The conversation must stay supportive, safe, and relevant to hospital waiting experiences.

Task: Decide if the user's message can be posted.
Rules:
- Block toxicity, harassment, hate, self-harm encouragement, medical advice, spam/ads, or irrelevant/negative rants.
- Block content that could harm safety or privacy.
- Allow empathetic sharing.

Respond ONLY with valid JSON matching:
{
  "allowed": boolean,
  "category": "toxicity" | "harassment" | "hate" | "spam" | "irrelevant" | "safety" | "medical_advice" | "negativity" | "self_harm" | "other" | "allowed",
  "reason": "short human-friendly explanation"
}

Message:
"""${message.trim()}"""

Context:
${contextSummary || 'No additional context'}
`.trim();

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 150,
          topP: 0.8
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return { allowed: true };
    }

    const data = await response.json();
    const rawText =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text ?? '')
        .join('\n')
        .trim() || '';

    if (!rawText) {
      console.warn('Gemini API returned empty content.');
      return { allowed: true };
    }

    const jsonText = rawText.match(/\{[\s\S]*\}/)?.[0] ?? rawText;
    const parsed = JSON.parse(jsonText);

    return {
      allowed: Boolean(parsed.allowed),
      category: parsed.category || (parsed.allowed ? 'allowed' : 'other'),
      reason: parsed.reason || (parsed.allowed ? undefined : 'Message blocked by moderation'),
      rawResponse: data
    };
  } catch (error) {
    console.error('Gemini moderation failed:', error);
    return { allowed: true };
  }
}

