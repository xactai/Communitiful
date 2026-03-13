# 🏥 The Communitiful — Implementation Document

## 📘 Overview
**The Communitiful** (formerly Companions Anonymous) is an end-to-end application built to support companions of hospital patients through a **safe, anonymous, and moderated digital environment**.  
The application has two core modules — **Hospital Mode** and **Companion Mode** — that work together to enable **secure registration, authentication, and peer-to-peer engagement** within a hospital's premises.

The system has been fully implemented using **Supabase** as the backend, ensuring **real-time updates, secure data handling, and scalable infrastructure**. The app features **bilingual support** (English/Hindi) with seamless language switching and comprehensive internationalization.

---

## ⚙️ Core Modules

### 1. 🏥 Hospital Mode
This module enables hospitals to capture essential **patient** and **companion** details during registration. It helps onboard companions and securely link their information for authentication in the chatroom module.

#### 🧩 Implementation Summary
- Developed a **hospital-facing registration form** structured into two sections:
  - **Patient Details:** Basic information (name, mobile number, department, purpose of visit)
  - **Companion Details:** Name, mobile number (for authentication), relationship, location, and consent flag
- **Form Validation & UX:**
  - All required field labels marked with asterisks (*) for clarity
  - **Mandatory Location Fetching:** Companions must fetch their location before submission
  - Real-time location fetching with visual feedback
  - Country code selection for international mobile numbers
- Upon submission:
  - Data is securely stored in a **Supabase table**
  - Each submission generates a **timestamped record** linking patient and companion details
- Built-in **validation** and **duplicate checks** to prevent redundant registrations
- **Responsive and optimized UI** for front-desk use

#### 🗄️ Data Model Highlights
Each registration record in Supabase includes:
- Patient details *(non-sensitive, limited fields)*
- Companion details *(mobile, name, consent flag)*
- Registration timestamp & hospital identifier
- Geo-coordinates for registration location

This data forms the foundation for **Companion Mode authentication**.

---

### 2. 💬 Companion Mode
This module allows registered companions to **log in, join an anonymous chatroom**, and engage with peers or a **virtual agent** within a geo-fenced area.

#### 🔐 Authentication
- Companions authenticate using their **registered mobile number**
- System performs a **lookup in Supabase**
- Only registered companions gain access; **unregistered numbers are blocked**
- **Single Active Session Enforcement:** Users with the same mobile number cannot stay logged in on two devices simultaneously
  - New login attempts are blocked if an active session exists
  - Clear error messages guide users to log out from other devices
  - Session deactivation on logout ensures proper cleanup
  - Prevents account sharing and maintains session security

#### 🕵️ Anonymity System
On first login, each companion is automatically assigned:
- A **randomly generated avatar**
- A **non-editable display name**
  
These identifiers remain fixed throughout the session, ensuring **complete anonymity**.  
No personal or identifiable information is ever displayed or retrievable during interactions.

#### 💭 Chatroom Experience
- Real-time message exchange among companions
- **Reply to Message Functionality:** WhatsApp-style reply feature
  - **Reply Triggers:** Long-press (500ms) or swipe right on any message
  - **Reply Preview Bar:** Shows above input with sender name and message snippet
  - **Reply Headers:** Sent messages display reply context with left border highlight
  - **Jump to Original:** Click reply header to scroll and highlight the original message
  - **Smooth Animations:** Yellow highlight fade effect when jumping to replied messages
- **Virtual Agent** ensures engagement even during low activity:
  - Responds automatically if messages go unanswered
  - Provides **supportive and context-aware** replies
- Encourages emotional support through an empathetic chat environment

#### 🧰 Content Moderation
- Every message is screened by **Gemini 2.5 Flash** via the Gemini API (auto-falling back to **Gemini 2.5 Pro** if the flash tier is unavailable)
- The moderator blocks harassment, hate, spam, irrelevant or negative rants, unsafe requests, violence/threats, sexual content, self-harm mentions, medical misinformation, and any disturbing or off-topic chatter
- **Enhanced Privacy Protection:**
  - **Mobile Number Blocking:** Advanced detection prevents sharing of phone numbers (with or without country codes)
  - Supports multiple formats: international (+91, +1, etc.), US/Canada, Indian 10-digit, and keyword-based patterns
  - Email addresses and URLs are also blocked
  - Clear privacy-focused error messages guide users
- Blocked attempts return a **clear reason** in the chat UI while keeping the text local for editing
- Ensures a **safe, respectful, and purpose-driven** chat environment with real-time transparency

#### 📍 Geo-Fencing
- Chatroom participation restricted to **hospital premises**
- Companion’s live location is validated continuously
- Leaving the defined geofence triggers **auto sign-out**
- Maintains **contextual relevance** and **privacy**

#### 🕒 Session Management
- Secure session tokens issued at authentication and invalidated upon:
  - Sign-out
  - Geo-fence breach
- **Single Active Session Rule:**
  - Database-backed session tracking via `active_sessions` table
  - One active session per mobile number enforced at login
  - Automatic session cleanup on logout
  - Prevents simultaneous multi-device access for security
- **Inactivity timeouts** auto-terminate idle sessions
- Seamless sign-in/out flows ensure data security

#### 🧘 Relaxation Corner
A dedicated space offering **micro-games and calming activities** to help companions manage stress and anxiety while waiting:
- **Breathing Exercise:** Guided 4-7-8 breathing technique with visual timer and total time tracking
- **Grounding 5-4-3-2-1:** Interactive sensory grounding exercise
- **Memory Match:** Simple emoji pair-matching game for distraction
- **Gratitude Journaling:** Prompts to encourage positive reflection and gratitude
- **Color Focus:** Soothing color panels for visual meditation
- **Minimalist UI:** Clean, intuitive game selection interface with smooth transitions
- All activities are **fully translated** and accessible in both English and Hindi
- Accessible from both Chatroom and Settings for convenience

#### 🌐 Internationalization (i18n)
Comprehensive **multi-language support** for broader accessibility:
- **Language Toggle:** Prominently placed at top of Landing Page with visual indicator
- **Dynamic Translation:** All content updates instantly when language changes
- **Supported Languages:** English (default) and Hindi (हिंदी)
- **Complete Coverage:** All pages, buttons, labels, messages, and features are translated
- **Translation System:** Custom hook (`useTranslation`) with Zustand state management and fallback to English
- **Persistent Preference:** Language choice saved in settings and persists across sessions
- **Brand Consistency:** Brand name "The Communitiful" maintained across all languages
- **Seamless Switching:** Language can be changed at any time from Settings page

#### 📊 User Feedback System
**Exit feedback modal** to gather user experience insights:
- Triggered when users click "Leave Chat Room" button in Settings
- **Rating System:** 1-5 emoji-based rating scale (😞 to 😊)
- **Optional Text Feedback:** Free-form suggestions and comments
- **Thank You Screen:** Acknowledgment with smooth transition and redirect message
- **Auto-redirect:** Returns to landing page after submission
- **Non-intrusive Design:** Clean, friendly, and visually appealing
- **Bilingual Support:** Feedback interface available in both English and Hindi

#### 🌐 Website Integration
- **Landing Page Link:** Direct link to project website for mission and impact information
- **External Navigation:** Opens in new tab with proper security attributes (noopener, noreferrer)
- **User Education:** Provides additional context about The Communitiful's purpose and values

#### 👥 Enhanced User Presence
- **Online User Count:** Prominently displayed badge showing active companions
- **Join/Leave Notifications:** Subtle notifications when users enter or exit
- **Real-time Updates:** Live count updates as companions join/leave
- **Visual Indicators:** Clear status badges and icons

---

## 🔒 Data Privacy & Security
All privacy and compliance principles are integrated throughout the implementation.

| Principle | Description |
|------------|--------------|
| **Minimal Data Storage** | Only essential patient and companion details are stored |
| **Encryption** | Data encrypted both **in transit** and **at rest** |
| **Consent-Driven** | Participation and location sharing require explicit consent |
| **Access Controls** | Hospital staff access limited to operational needs |
| **Audit Logs** | Registrations, moderation events, and geo-fence exits logged |
| **Data Retention** | Chatroom data follows defined retention and purge cycles |
| **Contact Information Protection** | Advanced detection blocks sharing of mobile numbers, email addresses, and URLs in chat |
| **Single Session Enforcement** | Database-backed session tracking prevents simultaneous multi-device access |
| **Session Isolation** | Each mobile number can only have one active session at a time |

---

## 🧱 Technical Infrastructure

| Component | Technology |
|------------|-------------|
| **Backend** | Supabase (Auth, Database, Real-time updates) |
| **Frontend** | React (Responsive UI for both modes) |
| **Real-Time Messaging** | Supabase Realtime APIs |
| **Moderation Layer** | Message validation logic before broadcast |
| **Virtual Agent** | LLM-based automated engagement system |
| **Geo-Fencing** | Client-side location APIs + server-side validation |
| **Internationalization** | Custom translation system with Zustand state management |
| **Animations** | Framer Motion for smooth, performant transitions |
| **Styling** | Tailwind CSS with custom design tokens |
| **Session Management** | Database-backed active session tracking with Supabase |
| **Reply System** | JSONB storage for reply context, React refs for scroll-to functionality |
| **Privacy Protection** | Regex-based pattern matching with multi-format support |

---

## 🎨 User Experience Highlights
- **Mobile-first** and **fast-loading** hospital registration UI  
- **One-tap authentication** using registered mobile number  
- **Anonymous yet emotionally engaging** chat experience  
- **Reply to Messages:** Contextual conversations with WhatsApp-style reply feature (long-press/swipe)
- **Virtual Agent fallback** to keep conversations active  
- **Robust moderation** for safe user interactions  
- **Enhanced Privacy:** Automatic blocking of phone numbers, emails, and URLs
- **Geo-fenced** participation for privacy and relevance  
- **Bilingual Interface:** Full English/Hindi support with prominent language toggle
- **Relaxation Corner** with multiple stress-relief activities (breathing, grounding, memory, gratitude, color)
- **Soothing visual design** with calming colors and animations
- **Enhanced button visibility** with borders and hover effects
- **User feedback collection** for continuous improvement
- **Clear Form Labels:** Asterisk-marked required fields for better UX
- **Location Validation:** Mandatory location fetching ensures accurate data
- **Website Integration:** Direct link to project website from landing page
- **Single Active Session:** Secure session management prevents multi-device access

---

## 🎨 Visual Design & UI Enhancements

### Landing Page
- **Soothing Background:** Multi-color gradient (soft blues, yellows, pinks, lavender) with animated shifts
- **Decorative Elements:** Subtle floating healthcare/companionship-themed emojis (❤️ 🤝 🕊️ 💚 🧘 🌿)
- **Abstract Shapes:** Gentle pulsing circular borders for depth
- **Logo Effects:** Enhanced shadow effects with layered depth and brand-colored glow
- **Smooth Animations:** Fade-in, slide-up, and pulse effects for premium feel
- **Language Toggle:** Prominent language switcher at top with visual indicator (EN ⇄ HI)
- **Website Link:** Integrated link to project website with hover effects and clear call-to-action
- **Brand Identity:** "The Communitiful" prominently displayed with consistent branding

### Navigation & Buttons
- **Enhanced Visibility:** All navigation buttons feature prominent borders (2px, primary color)
- **Consistent Styling:** Unified border treatment across:
  - Back buttons (all pages)
  - Settings, Relaxation, and Exit buttons (chatroom)
  - Avatar display (chatroom header)
- **Hover Effects:** Interactive feedback with border color changes and subtle background tints
- **Accessibility:** Clear visual hierarchy and touch-friendly sizing

### Color Scheme
- **Calming Palette:** Medical-inspired soft colors promoting trust and calm
- **Gradient Backgrounds:** Smooth transitions between complementary hues
- **Low Opacity Decorations:** Subtle elements that don't distract from content
- **Brand Consistency:** Primary colors used consistently across all UI elements

---

## 💼 Business & Marketing Relevance

| Benefit | Description |
|----------|--------------|
| **Hospital Engagement** | Adds emotional support for companions and improves hospital service experience |
| **Trust & Safety** | Strengthens hospital credibility via privacy-first design |
| **Branding Opportunity** | Hospitals can co-brand the app to enhance patient-care perception |
| **Analytics** | Engagement metrics & conversation trends help shape hospital CSR programs |

---

## 📝 Recent Updates & Enhancements

### Version 1.3.0 (Latest)
- ✅ **Brand Update:** Application title updated to "The Communitiful" across all interfaces
- ✅ **Bilingual Support Enhancement:** Prominent language toggle on landing page with persistent preferences
- ✅ **Website Integration:** Direct link to project website from landing page for mission and impact information
- ✅ **Relaxation Corner Expansion:** Enhanced activities with improved UI and smooth transitions
- ✅ **Settings Enhancements:** Feedback collection system with bilingual support
- ✅ **Translation Coverage:** Complete translation of all new features and UI elements
- ✅ **Brand Consistency:** Unified brand name "The Communitiful" across all languages

### Version 1.2.0
- ✅ **Reply to Message Functionality:** WhatsApp-style reply feature with long-press and swipe gestures
- ✅ **Single Active Session Enforcement:** Prevents simultaneous logins from multiple devices
- ✅ **Enhanced Privacy Protection:** Advanced mobile number detection blocks contact sharing
- ✅ **Form Field Labels:** All required fields marked with asterisks for clarity
- ✅ **Mandatory Location Fetching:** Location must be fetched before form submission
- ✅ **Improved Message Handling:** Better state management for real-time message updates

### Version 1.1.0
- ✅ **Internationalization System:** Full English/Hindi support across all pages
- ✅ **Relaxation Corner:** Five micro-games for stress relief and mindfulness
- ✅ **Enhanced UI/UX:** Improved button visibility, shadows, and visual hierarchy
- ✅ **Feedback System:** Exit feedback modal with rating and text input
- ✅ **Visual Design:** Soothing backgrounds, decorative elements, and animations
- ✅ **User Presence:** Enhanced online user count display and notifications
- ✅ **Accessibility:** Better touch targets, borders, and visual feedback

### Key Improvements (v1.3.0)
1. **Brand Identity:** Unified brand name "The Communitiful" creates consistent user experience
2. **Accessibility:** Enhanced language support with prominent toggle improves inclusivity
3. **User Education:** Website integration provides additional context and mission information
4. **Wellness:** Expanded Relaxation Corner offers more stress-relief options
5. **Feedback:** Bilingual feedback system enables better user experience insights

---

## 🗄️ Database Schema Updates

### Active Sessions Table
- **Purpose:** Track active user sessions to enforce single-device login
- **Schema:** `active_sessions` table with columns:
  - `mobile_number` (TEXT): User's mobile number
  - `session_id` (TEXT): Unique session identifier
  - `is_active` (BOOLEAN): Session status flag
  - `created_at` (TIMESTAMP): Session creation time
  - `last_seen_at` (TIMESTAMP): Last activity timestamp
- **Indexes:** Optimized queries for mobile number and session lookups
- **Migration:** `active-sessions-migration.sql` (if needed)

### Messages Table Enhancement
- **New Column:** `reply_to` (JSONB) for storing reply context
- **Structure:** Stores messageId, text snippet, sender name, and avatar
- **Migration:** `reply-functionality-migration.sql`

---

## 🧩 Summary
**The Communitiful** brings technology, empathy, and privacy together to create a **safe, supportive, and inclusive** experience for hospital companions — a step toward more **human-centered healthcare ecosystems**.

The application continues to evolve with **comprehensive bilingual support**, **wellness features**, **enhanced chat functionality**, **improved security**, and **unified brand identity** to better serve companions during their waiting periods. With features like reply functionality, relaxation corner, single active session enforcement, and privacy protection, The Communitiful provides a holistic solution for emotional support in hospital waiting areas.

---

**Built with ❤️ using React + Supabase + Gemini**

**Last Updated:** January 2025
