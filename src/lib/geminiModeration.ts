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

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_PRIMARY_MODEL = 'gemini-2.5-flash';
const GEMINI_FALLBACK_MODEL = 'gemini-2.5-pro';

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
Block ANY message that includes:
- abusive, insulting, or harassing language (personal attacks, name-calling, bullying, mocking illnesses/age/gender/caste/religion/any attribute)
- hate speech or discrimination targeting religion, caste, ethnicity, nationality, gender identity, sexual orientation, disabilities, or age groups
- violence or threats (including encouragement of harm toward companions or hospital staff)
- sexual content (explicit, flirtatious, jokes, innuendo, adult references)
- self-harm mentions, suicidal intent, or encouragement of self-harm
- medical misinformation (fake advice, unverified cures, dangerous suggestions)
- spam, scams, promotions, requests for money, external links, ads, or chain messages
- irrelevant/off-topic chatter (politics, religious preaching, non-care gossip, offensive humor) that distracts from supportive waiting-room conversation
- extremely negative, disturbing, or fear-inducing content likely to increase stress for waiting families
- phone numbers, mobile numbers, or contact information (including with country codes like +91, +1, etc.) - STRICTLY BLOCK any sharing of contact details for privacy protection

Allow empathetic sharing that stays supportive and relevant.

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
    const apiPayload = {
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
    };

    const response = await callGeminiGenerateContent(
      GEMINI_PRIMARY_MODEL,
      apiPayload
    );

    const data = await parseGeminiResponse(response, apiPayload);
    if (!data) {
      return { allowed: true };
    }

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

async function callGeminiGenerateContent(model: string, payload: any) {
  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

async function parseGeminiResponse(response: Response, payload: any) {
  if (response.ok) {
    return response.json();
  }

  const errorText = await response.text();
  console.error(`Gemini API error (${response.status}):`, errorText);

  if (response.status === 404 && !response.url.includes(GEMINI_FALLBACK_MODEL)) {
    console.warn('Primary Gemini model unavailable. Falling back to stable model.');
    const fallbackResponse = await callGeminiGenerateContent(
      GEMINI_FALLBACK_MODEL,
      payload
    );

    if (fallbackResponse.ok) {
      return fallbackResponse.json();
    }

    console.error(
      `Gemini fallback model error (${fallbackResponse.status}):`,
      await fallbackResponse.text()
    );
  }

  return null;
}

