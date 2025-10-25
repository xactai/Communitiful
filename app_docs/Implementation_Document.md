# 🏥 Companions Anonymous — Implementation Document

## 📘 Overview
**Companions Anonymous** is an end-to-end application built to support companions of hospital patients through a **safe, anonymous, and moderated digital environment**.  
The application has two core modules — **Hospital Mode** and **Companion Mode** — that work together to enable **secure registration, authentication, and peer-to-peer engagement** within a hospital’s premises.

The system has been fully implemented using **Supabase** as the backend, ensuring **real-time updates, secure data handling, and scalable infrastructure**.

---

## ⚙️ Core Modules

### 1. 🏥 Hospital Mode
This module enables hospitals to capture essential **patient** and **companion** details during registration. It helps onboard companions and securely link their information for authentication in the chatroom module.

#### 🧩 Implementation Summary
- Developed a **hospital-facing registration form** structured into two sections:
  - **Patient Details:** Basic information (name, department, purpose of visit)
  - **Companion Details:** Name, mobile number (for authentication), location, and consent flag
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

#### 🕵️ Anonymity System
On first login, each companion is automatically assigned:
- A **randomly generated avatar**
- A **non-editable display name**
  
These identifiers remain fixed throughout the session, ensuring **complete anonymity**.  
No personal or identifiable information is ever displayed or retrievable during interactions.

#### 💭 Chatroom Experience
- Real-time message exchange among companions
- **Virtual Agent** ensures engagement even during low activity:
  - Responds automatically if messages go unanswered
  - Provides **supportive and context-aware** replies
- Encourages emotional support through an empathetic chat environment

#### 🧰 Content Moderation
- Every message passes through a **content moderation layer**
- Filters out harassment, abuse, or off-topic content
- Violating messages are **blocked** and users are **notified**
- Ensures a **safe, respectful, and purpose-driven** chat environment

#### 📍 Geo-Fencing
- Chatroom participation restricted to **hospital premises**
- Companion’s live location is validated continuously
- Leaving the defined geofence triggers **auto sign-out**
- Maintains **contextual relevance** and **privacy**

#### 🕒 Session Management
- Secure session tokens issued at authentication and invalidated upon:
  - Sign-out
  - Geo-fence breach
- **Inactivity timeouts** auto-terminate idle sessions
- Seamless sign-in/out flows ensure data security

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

---

## 🎨 User Experience Highlights
- **Mobile-first** and **fast-loading** hospital registration UI  
- **One-tap authentication** using registered mobile number  
- **Anonymous yet emotionally engaging** chat experience  
- **Virtual Agent fallback** to keep conversations active  
- **Robust moderation** for safe user interactions  
- **Geo-fenced** participation for privacy and relevance  

---

## 💼 Business & Marketing Relevance

| Benefit | Description |
|----------|--------------|
| **Hospital Engagement** | Adds emotional support for companions and improves hospital service experience |
| **Trust & Safety** | Strengthens hospital credibility via privacy-first design |
| **Branding Opportunity** | Hospitals can co-brand the app to enhance patient-care perception |
| **Analytics** | Engagement metrics & conversation trends help shape hospital CSR programs |

---

## 🧩 Summary
**Companions Anonymous** brings technology, empathy, and privacy together to create a **safe, supportive, and inclusive** experience for hospital companions — a step toward more **human-centered healthcare ecosystems**.

---

**Built with ❤️ using React + Supabase**
