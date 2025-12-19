# 🏥 Communitiful — README

## 📘 Overview
Communitiful (formerly Companions Anonymous) is a privacy-first, geo-aware chat app that supports companions waiting in hospital lobbies. The experience is anonymous, safety-moderated, and optimized for mobile. The app runs in two modes:
- Hospital Mode: registration desk captures patient and companion details
- Companion Mode: verified companions access a moderated, anonymous chatroom on-site

Backend services are powered by Supabase (database + realtime). Content moderation is enforced via Google Gemini before messages are posted.

---

## 🏥 Hospital Mode (Registration)

Used by hospital staff to register the visiting patient and their companions.

### ✳️ Key Features
- 📋 Patient + Companion registration with validations
- 🌍 International mobile number input:
  - Country code selector with flag (default: 🇮🇳 +91)
  - Numbers stored as `{countryCode}{localNumber}` for consistency in the number format
- 📍 **Mandatory Location Fetching:** All companions must fetch their location before form submission
- ✳️ **Clear Field Labels:** All required fields marked with asterisks (*) for better UX
- 🔐 Data stored securely in Supabase
- 📱 Mobile and tablet friendly UI
- 🧩 Clean data controls: duplicates and basic field checks

---

## 💬 Companion Mode (On-site Chat)

Accessible only to companions registered via Hospital Mode and physically present at partner hospitals.

### ✳️ Flow
1) Location Scan (visual simulation)
   - Subtle animated radar/sweep bar indicating access verification
   - “Location check passed” acknowledgment
   - “Powered by Google Maps” badge for credibility
2) Companion Verification
   - Login with the registered phone number
   - Accepts full international format and legacy 10-digit records for compatibility
   - **Single Active Session:** Only one device can be logged in per mobile number at a time
   - New login attempts are blocked if an active session exists on another device
3) Disclaimer and Identity
   - Clear usage disclaimer (no medical advice)
   - Anonymous nickname and emoji avatar assigned for the session
4) Chatroom
   - Real-time messaging with peers
   - Apollo branding for partner hospital context

### ✳️ Chat UX
- Softer, rounded message bubbles with subtle elevation
- Primary gradient styling for your messages
- Timestamp chips and pending "Checking…" indicator for moderation state
- Presence and typing indicators
- **Reply to Messages:** WhatsApp-style reply functionality
  - Long-press (500ms) or swipe right on any message to reply
  - Reply preview bar shows above input with original message context
  - Reply headers in sent messages with clickable jump-to-original feature
  - Smooth scroll and highlight animation when jumping to replied messages

---

## 🛡️ Moderation & Safety

All messages are screened before posting:
- 🔎 Primary: Gemini 2.5 Flash (latest) moderation with a structured JSON contract
- 🔁 Fallback: Gemini 2.5 Pro if "latest" is unavailable
- 🧭 Blocks: abuse/harassment, hate, violence/threats, sexual content, self-harm, medical misinformation, spam/ads/links, off-topic/religious/political content, and highly disturbing negativity
- 📱 **Enhanced Privacy Protection:**
  - Advanced detection blocks sharing of mobile numbers (all formats: international, US/Canada, Indian 10-digit)
  - Blocks email addresses and URLs
  - Keyword-based detection for phone numbers with context (e.g., "call me at", "my number is")
  - Clear privacy-focused error messages
- 💡 On block: message isn't posted; user sees a clear reason
- ⚠️ Safety nudges for emergencies redirect to hospital staff

If the moderation API fails, the app safely degrades to permissive behavior while logging errors.

---

## 🔒 Privacy & Security

| Principle | Description |
|------------|--------------|
| Minimal Data Storage | Only essential information is collected and retained |
| Anonymity | Avatars and nicknames conceal identity; no PII displayed |
| Encryption | Data encrypted in transit and at rest |
| Consent-Driven | Explicit consent for chat participation and location checks |
| Access Scope | Chat is restricted to hospital premises |
| Contact Protection | Automatic blocking of phone numbers, emails, and URLs in chat messages |
| Single Session | Database-backed session tracking prevents simultaneous multi-device access |

Dedicated Privacy & Terms page is accessible from Landing and Settings.

---

## 🧱 Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React + Vite, Tailwind variants, Framer Motion |
| Backend | Supabase (DB, Realtime, Auth bootstrap) |
| Moderation | Google Gemini 2.5 Flash Latest (fallback: 2.5 Pro) |
| Realtime Chat | Supabase realtime channel on `messages` table |
| Location UX | Animated simulation + Google Maps credit |
| Session Management | Database-backed active session tracking |
| Reply System | JSONB storage for reply context, React refs for scroll-to |
| Privacy Protection | Regex-based pattern matching with multi-format support |

---

## 🗄️ Data Model (Core)

- patients
  - patient_id (uuid, client-generated)
  - name
  - patient_contact_number (stored as "+<country_code><local>")
  - purpose_of_visit, department, location
- companions
  - patient_id (fk)
  - name, relationship
  - number (stored as "+<country_code><local>")
  - location
- messages
  - id (uuid), room_id, clinic_id, session_id, author_type
  - text, created_at
  - moderation_status, moderation_reason
  - reply_to (JSONB) - stores reply context: messageId, text snippet, sender name, avatar
- active_sessions
  - id (uuid), mobile_number, session_id
  - is_active (boolean), created_at, last_seen_at
  - Enforces single active session per mobile number

Lookup logic for verification now supports both "+<country_code><local>" and legacy 10-digit values for backward compatibility.

---

## 🔁 Realtime & De-duplication

Realtime updates listen to Supabase `INSERT/UPDATE/DELETE` on `messages`. Duplicate render issues are prevented by ID-based upsert logic before notifying listeners.

---

## 🎨 UX Highlights

- Landing: gentle animations, clean visual hierarchy, clear entry points
- Location Scan: animated radar/sweep, Maps credit, auto-continue
- Companion Auth: international phone input (flag + code + number)
- Settings: direct navigation to Privacy & Terms and About Companions pages
- About & Privacy: minimalist cards with calm motion and clear purpose statements

---

## 🚀 Deployment & Status
✅ Supabase integration live  
✅ Location scan and on-site access flow integrated  
✅ Moderation enforced pre-post via Gemini  
✅ Realtime chat, presence, and typing indicators  
✅ **Reply to Message functionality** with gesture support  
✅ **Single Active Session enforcement** for security  
✅ **Enhanced privacy protection** (mobile number blocking)  
✅ **Form improvements** (asterisk labels, mandatory location)  
✅ Ready for pilot deployment with hospital partners  

## 📝 Recent Updates (v1.2.0)
- ✅ Reply to Message: WhatsApp-style reply with long-press and swipe gestures
- ✅ Single Active Session: Database-backed enforcement prevents multi-device access
- ✅ Privacy Protection: Advanced phone number detection blocks contact sharing
- ✅ Form Enhancements: Clear field labels and mandatory location fetching
- ✅ Brand Update: Application title updated to "Communitiful"

---

## 🧭 Purpose
Provide a calm, anonymous space that supports companions emotionally during hospital waits, while keeping safety, privacy, and on-site relevance at the core.

---

Built with ❤️ using React + Supabase + Gemini
