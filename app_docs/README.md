# 🏥 Companions Anonymous — README

## 📘 Overview
Companions Anonymous is a privacy-first, geo-aware chat app that supports companions waiting in hospital lobbies. The experience is anonymous, safety-moderated, and optimized for mobile. The app runs in two modes:
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
3) Disclaimer and Identity
   - Clear usage disclaimer (no medical advice)
   - Anonymous nickname and emoji avatar assigned for the session
4) Chatroom
   - Real-time messaging with peers
   - Apollo branding for partner hospital context

### ✳️ Chat UX
- Softer, rounded message bubbles with subtle elevation
- Primary gradient styling for your messages
- Timestamp chips and pending “Checking…” indicator for moderation state
- Presence and typing indicators

---

## 🛡️ Moderation & Safety

All messages are screened before posting:
- 🔎 Primary: Gemini 2.5 Flash (latest) moderation with a structured JSON contract
- 🔁 Fallback: Gemini 2.5 Pro if “latest” is unavailable
- 🧭 Blocks: abuse/harassment, hate, violence/threats, sexual content, self-harm, medical misinformation, spam/ads/links, off-topic/religious/political content, and highly disturbing negativity
- 💡 On block: message isn’t posted; user sees a clear reason
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

---

## 🗄️ Data Model (Core)

- patients
  - patient_id (uuid, client-generated)
  - name
  - patient_contact_number (stored as “+<country_code><local>”)
  - purpose_of_visit, department, location
- companions
  - patient_id (fk)
  - name, relationship
  - number (stored as “+<country_code><local>”)
  - location
- messages
  - id (uuid), room_id, clinic_id, session_id, author_type
  - text, created_at
  - moderation_status, moderation_reason

Lookup logic for verification now supports both “+<country_code><local>” and legacy 10-digit values for backward compatibility.

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
✅ Ready for pilot deployment with hospital partners  

---

## 🧭 Purpose
Provide a calm, anonymous space that supports companions emotionally during hospital waits, while keeping safety, privacy, and on-site relevance at the core.

---

Built with ❤️ using React + Supabase + Gemini
