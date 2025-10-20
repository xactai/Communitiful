Companions Anonymous — README
Overview

Companions Anonymous is a privacy-first application built to support companions of hospital patients through an anonymous, moderated, and geo-fenced chat platform.
The app operates in two modes — Hospital Mode and Companion Mode — seamlessly integrated through a Supabase backend.

1. Hospital Mode

Used by hospitals to register patient and companion details at the time of a visit.

Key Features

Registration form for Patient and Companion details.

Companion’s mobile number used for later authentication.

Records stored securely in Supabase.

Optimized for mobile and tablet hospital desks.

Validations to prevent duplicate entries and ensure clean data.

2. Companion Mode

Accessible only to companions registered through Hospital Mode.

Key Features

Authentication: Login via registered mobile number (verified through Supabase).

Anonymity: System assigns a random name and avatar — fixed per session, non-editable.

Chatroom: Real-time messaging with peers; anonymous environment maintained.

Virtual Agent: Responds automatically during inactivity to keep conversations active.

Moderation: Filters block abusive, off-topic, or unsafe messages before posting.

Geo-Fencing: Access restricted to hospital premises; users auto-signed out if they exit the zone.

Privacy & Security

Minimal data stored; no PII displayed in chat.

All communication is encrypted (in-transit & at-rest).

Explicit user consent required for participation and location tracking.

Comprehensive logging and retention policy implemented for compliance.

Tech Stack

Frontend: React (responsive for mobile & web)

Backend: Supabase (auth, database, real-time updates)

Moderation: Custom logic integrated pre-message post

Virtual Agent: LLM-based automated responder

Geo-Fencing: Client-side location with server validation

Current Status

✅ Development completed
✅ Supabase integration live
✅ Chatroom, moderation, and virtual agent tested
✅ Geo-fence and session management active
✅ Ready for pilot deployment in hospital environments

Purpose

To create a safe, supportive, and private space for companions of patients — combining emotional connection, digital privacy, and hospital-led engagement.