# 🏥 Communitiful — Implementation Document

## 📘 Overview
**Communitiful** (formerly Companions Anonymous) is an end-to-end application built to support companions of hospital patients through a **safe, anonymous, and moderated digital environment**.  
The application has two core modules — **Hospital Mode** and **Companion Mode** — that work together to enable **secure registration, authentication, and peer-to-peer engagement** within a hospital’s premises.

The system has been fully implemented using **Supabase** as the backend, ensuring **real-time updates, secure data handling, and scalable infrastructure**.

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
- **Breathing Exercise:** Guided 4-7-8 breathing technique with visual timer
- **Grounding 5-4-3-2-1:** Interactive sensory grounding exercise
- **Memory Match:** Simple emoji pair-matching game for distraction
- **Gratitude Moment:** Rotating prompts to encourage positive reflection
- **Color Focus:** Soothing color panels for visual meditation
- **Minimalist UI:** Clean, intuitive game selection interface
- All activities are **translated** and accessible in both English and Hindi

#### 🌐 Internationalization (i18n)
Comprehensive **multi-language support** for broader accessibility:
- **Language Toggle:** Prominently placed on Landing Page
- **Dynamic Translation:** All content updates instantly when language changes
- **Supported Languages:** English (default) and Hindi (हिंदी)
- **Complete Coverage:** All pages, buttons, labels, and messages are translated
- **Translation System:** Custom hook (`useTranslation`) with fallback to English
- **Consistent Experience:** Language preference persists across sessions

#### 📊 User Feedback System
**Exit feedback modal** to gather user experience insights:
- Triggered when users click "Leave Chat Room" button
- **Rating System:** 1-5 emoji-based rating scale (😞 to 😊)
- **Optional Text Feedback:** Free-form suggestions and comments
- **Thank You Screen:** Acknowledgment with smooth transition
- **Auto-redirect:** Returns to landing page after submission
- **Non-intrusive Design:** Clean, friendly, and visually appealing

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
- **Reply to Messages:** Contextual conversations with WhatsApp-style reply feature
- **Virtual Agent fallback** to keep conversations active  
- **Robust moderation** for safe user interactions  
- **Enhanced Privacy:** Automatic blocking of phone numbers and contact information
- **Geo-fenced** participation for privacy and relevance  
- **Multi-language support** (English/Hindi) for inclusive access
- **Relaxation Corner** with stress-relief micro-games
- **Soothing visual design** with calming colors and animations
- **Enhanced button visibility** with borders and hover effects
- **User feedback collection** for continuous improvement
- **Clear Form Labels:** Asterisk-marked required fields for better UX
- **Location Validation:** Mandatory location fetching ensures accurate data

---

## 🎨 Visual Design & UI Enhancements

### Landing Page
- **Soothing Background:** Multi-color gradient (soft blues, yellows, pinks, lavender) with animated shifts
- **Decorative Elements:** Subtle floating healthcare/companionship-themed emojis (❤️ 🤝 🕊️ 💚 🧘 🌿)
- **Abstract Shapes:** Gentle pulsing circular borders for depth
- **Logo Effects:** Enhanced shadow effects with layered depth and brand-colored glow
- **Smooth Animations:** Fade-in, slide-up, and pulse effects for premium feel

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

### Version 1.2.0 (Latest)
- ✅ **Reply to Message Functionality:** WhatsApp-style reply feature with long-press and swipe gestures
- ✅ **Single Active Session Enforcement:** Prevents simultaneous logins from multiple devices
- ✅ **Enhanced Privacy Protection:** Advanced mobile number detection blocks contact sharing
- ✅ **Form Field Labels:** All required fields marked with asterisks for clarity
- ✅ **Mandatory Location Fetching:** Location must be fetched before form submission
- ✅ **Brand Update:** Application title updated to "Communitiful"
- ✅ **Improved Message Handling:** Better state management for real-time message updates

### Version 1.1.0
- ✅ **Internationalization System:** Full English/Hindi support across all pages
- ✅ **Relaxation Corner:** Five micro-games for stress relief and mindfulness
- ✅ **Enhanced UI/UX:** Improved button visibility, shadows, and visual hierarchy
- ✅ **Feedback System:** Exit feedback modal with rating and text input
- ✅ **Visual Design:** Soothing backgrounds, decorative elements, and animations
- ✅ **User Presence:** Enhanced online user count display and notifications
- ✅ **Accessibility:** Better touch targets, borders, and visual feedback

### Key Improvements (v1.2.0)
1. **Enhanced Chat Experience:** Reply functionality makes conversations more contextual and easier to follow
2. **Security:** Single active session prevents unauthorized access and account sharing
3. **Privacy:** Advanced phone number blocking protects user contact information
4. **Form Usability:** Clear field labels and mandatory location ensure complete data collection
5. **User Experience:** Smooth animations and intuitive gestures improve interaction quality

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
**Communitiful** brings technology, empathy, and privacy together to create a **safe, supportive, and inclusive** experience for hospital companions — a step toward more **human-centered healthcare ecosystems**.

The application continues to evolve with **multi-language support**, **wellness features**, **enhanced chat functionality**, and **improved security** to better serve companions during their waiting periods.

---

**Built with ❤️ using React + Supabase**

**Last Updated:** January 2025
