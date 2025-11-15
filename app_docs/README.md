# 🏥 Companions Anonymous — README

## 📘 Overview
**Companions Anonymous** is a **privacy-first application** built to support companions of hospital patients through an **anonymous, moderated, and geo-fenced chat platform**.  

The app operates in two distinct modes — **Hospital Mode** and **Companion Mode** — seamlessly integrated through a **Supabase backend** to ensure secure, real-time communication and compliance with data privacy standards.

---

## 🏥 1. Hospital Mode

Used by hospitals to **register patient and companion details** during visits.

### ✳️ Key Features
- 📋 Registration form for both **Patient** and **Companion** details  
- 📱 Companion’s **mobile number** used for later authentication  
- 🔒 Records stored **securely in Supabase**  
- 💻 Optimized for **mobile and tablet** hospital desks  
- 🧩 Built-in **validations** to prevent duplicate entries and ensure clean data  

---

## 💬 2. Companion Mode

Accessible **only to companions** registered through Hospital Mode.

### ✳️ Key Features
- 🔐 **Authentication:** Login via registered mobile number (verified through Supabase)  
- 🕵️ **Anonymity:** System assigns a random name and avatar — fixed per session, non-editable  
- 💭 **Chatroom:** Real-time messaging with peers in a completely anonymous environment  
- 🤖 **Virtual Agent:** Auto-responds during low activity to keep conversations active  
- 🧰 **Moderation:** Pre-message filtering blocks abusive, off-topic, or unsafe content  
- 📍 **Geo-Fencing:** Access restricted to hospital premises; users auto-signed out if they leave the area  

---

## 🔒 Privacy & Security

| Principle | Description |
|------------|--------------|
| **Minimal Data Storage** | Only essential, non-sensitive information is stored |
| **Anonymity** | No personally identifiable information (PII) displayed or shared |
| **Encryption** | All data encrypted both **in transit** and **at rest** |
| **Consent-Driven** | Explicit consent required for chat participation and location tracking |
| **Audit & Retention** | Comprehensive logging and defined data retention policies for compliance |

---

## 🧱 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React (responsive design for mobile and web) |
| **Backend** | Supabase (authentication, database, real-time updates) |
| **Moderation** | Custom pre-message validation and filtering logic |
| **Virtual Agent** | LLM-based automated responder for engagement |
| **Geo-Fencing** | Client-side location APIs + server-side validation |

---

## 🚀 Current Status
✅ Development completed  
✅ Supabase integration live  
✅ Chatroom, moderation, and virtual agent fully tested  
✅ Geo-fencing and session management active  
✅ Ready for **pilot deployment** in hospital environments  

---

## 🎯 Purpose
To create a **safe, supportive, and private digital space** for companions of hospital patients —  
blending **emotional connection**, **digital privacy**, and **hospital-led engagement**.

---

**Built with ❤️ using React + Supabase**
