# Leadership Flow Diagrams — The Communitiful

This document summarizes key user journeys and system flows for leadership review. Diagrams use Mermaid for clarity and can be previewed in Markdown viewers that support Mermaid.

---

## 1) Overview — Modes and Core Surfaces

```mermaid
flowchart LR
  A[Landing<br/>Language Toggle EN/HI] -->|Companion Mode| B(Location Scan)
  A -->|Hospital Mode| H(Hospital Registration)

  subgraph Companion Journey
    B --> C(Companion Auth<br/>Single Session Check)
    C --> D(Disclaimer)
    D --> E(Avatar Display)
    E --> F(Chatroom<br/>Relaxation Corner)
  end

  subgraph Hospital Desk
    H --> I[Supabase: patients]
    H --> J[Supabase: companions]
  end

  F <-- Realtime --> K[Supabase: messages]
  F --> L[Settings<br/>Feedback Collection]
```

---

## 2) Hospital Registration — Patient + Companions

```mermaid
flowchart TD
  A[Registration Form] --> B[Patient Details]
  A --> C[Companion Details (1..n)]

  B --> B1{Validate}
  B1 -->|ok| B2[Format patient number +country code]
  B1 -->|error| A

  C --> C1{Validate each companion}
  C1 -->|ok| C2[Format number +country code]
  C1 -->|error| A

  B2 --> D[Insert patients]
  C2 --> E[Insert companions]

  D --> F[Registration Complete]
  E --> F
```

Notes:
- International phone format is stored as “+<country_code><local_number>”.
- Form is mobile/tablet friendly for front-desk use.

---

## 3) Companion Mode — Entry Flow

```mermaid
sequenceDiagram
  participant U as User
  participant App as App (Client)
  participant Geo as Location Scan (UI)

  U->>App: Select Companion Mode
  App->>Geo: Start animated scan (radar + sweep)
  Geo-->>U: Location check passed + Powered by Google Maps
  App->>U: Redirect to Companion Verification
```

---

## 4) Companion Verification — Authentication with Single Session Check

```mermaid
sequenceDiagram
  participant U as User
  participant App as App (Client)
  participant DB as Supabase

  U->>App: Enter phone (+CC + local)
  App->>DB: Check companions.number IN [formatted, legacy 10-digit]
  DB-->>App: Match or No match
  alt match
    App->>DB: Check active_sessions for existing session
    DB-->>App: Active session status
    alt No active session
      App->>DB: Create new active session
      App-->>U: Proceed to Disclaimer
    else Active session exists
      App-->>U: Session already active on another device
    end
  else no match
    App-->>U: Not found (contact desk)
  end
```

Notes:
- Single active session enforcement prevents multi-device access per mobile number.
- Database-backed session tracking via `active_sessions` table.

---

## 5) Disclaimer → Identity → Chatroom

```mermaid
flowchart LR
  A[Disclaimer (no medical advice)] --> B[Anonymous Identity]
  B -->|nickname + avatar| C[Avatar Display]
  C --> D[Chatroom]
  D --> E[Relaxation Corner]
  D --> F[Settings]
```

Avatar:
- Session assigns an emoji-based avatar and nickname (non-editable per session).
- Avatar display shown before entering chatroom.

---

## 6) Message Lifecycle with Moderation & Reply Support

```mermaid
sequenceDiagram
  participant U as User
  participant App as Client
  participant Mod as Gemini API
  participant RT as Supabase Realtime

  U->>App: Type & Send Message<br/>(or Reply to message)
  App->>Mod: Pre-post moderation request<br/>(includes privacy checks: phone/email/URL)
  alt Allowed
    Mod-->>App: { allowed: true }
    App->>RT: Insert message (status: allowed)<br/>(with reply_to JSONB if replying)
    RT-->>App: Realtime broadcast
    App-->>U: Message visible<br/>(with reply context if applicable)
  else Blocked
    Mod-->>App: { allowed: false, reason }
    App-->>U: Show reason, do not post
  end
```

Block criteria (non-exhaustive):
- Abuse/harassment, hate/discrimination, violence/threats
- Sexual content, self-harm
- Medical misinformation
- Spam/ads/links, off-topic or religious/political preaching
- Excessively disturbing/negative content
- **Privacy violations:** Mobile numbers, email addresses, URLs

Reply functionality:
- Long-press (500ms) or swipe right to reply to any message
- Reply context stored in `reply_to` JSONB field (messageId, text snippet, sender info)
- Clickable jump-to-original message with smooth scroll animation

---

## 7) Realtime Chat — De-duplication & Presence

```mermaid
flowchart TD
  A[INSERT/UPDATE/DELETE payload] --> B{Upsert by ID}
  B -->|exists| C[Replace + sort]
  B -->|new| D[Push + sort]
  C --> E[Notify listeners]
  D --> E
```

Presence:
- Local “shared chat” and presence simulation with typing indicators.

---

## 8) Settings, Privacy & About

```mermaid
flowchart LR
  A[Chat Settings] --> B[Privacy & Terms page]
  A --> C[About The Communitiful]
  A --> D[Language Toggle<br/>EN/HI]
  A --> E[Feedback Collection]
  A --> F[Relaxation Corner]

  B -->|read-only| A
  C -->|read-only| A
  D -->|persist preference| A
  E -->|submit & exit| G[Landing]
```

Notes:
- Settings navigates to Privacy & Terms or About The Communitiful pages (read-only).
- Language preference persists across sessions.
- Feedback collection allows users to share experience before exiting.
- Relaxation Corner accessible from both Settings and Chatroom.

---

## 9) Data Model (Simplified)

```mermaid
erDiagram
  patients ||--o{ companions : has
  patients {
    uuid patient_id PK
    string name
    string patient_contact_number
    string purpose_of_visit
    string department
    string location
  }
  companions {
    uuid patient_id FK
    string name
    string relationship
    string number
    string location
  }
  messages {
    uuid id PK
    string room_id
    string clinic_id
    string session_id
    string author_type
    string text
    timestamptz created_at
    string moderation_status
    string moderation_reason
    jsonb reply_to
  }
  active_sessions {
    uuid id PK
    string mobile_number
    string session_id
    boolean is_active
    timestamptz created_at
    timestamptz last_seen_at
  }
```

Notes:
- `messages.reply_to` stores reply context as JSONB (messageId, text snippet, sender name, avatar).
- `active_sessions` enforces single active session per mobile number.

---

## 10) Error & Fallback Scenarios

```mermaid
flowchart TD
  A[Moderation API Error] --> B[Log + allow message cautiously]
  C[Realtime DB Error] --> D[Fallback to local shared chat]
  E[Auth No Match] --> F[Inform user to register at desk]
  G[Active Session Exists] --> H[Block login, inform user]
  I[Location Fetch Failed] --> J[Show error, retry option]
```

Notes:
- Single session enforcement blocks concurrent logins gracefully.
- Location fetching failures provide clear user feedback.

---

## 10.5) Landing Page Features

```mermaid
flowchart TD
  A[Landing Page] --> B[Language Toggle<br/>EN ⇄ HI]
  A --> C[Mode Selection<br/>Companion/Hospital]
  A --> D[Website Link<br/>Mission & Impact]
  A --> E[About & Privacy Links]
  
  B -->|Persist| F[Settings Store]
  C -->|Navigate| G[Selected Mode Flow]
  D -->|External| H[Project Website]
  E -->|Read-only| I[Info Pages]
```

Notes:
- Language toggle prominently displayed at top of landing page.
- Language preference persists across sessions via Zustand store.
- Website integration provides external link to project information.
- All features accessible before mode selection.

---

## 11) Branding & Partner Context

- **The Communitiful** brand name displayed on landing page and throughout app.
- Apollo Hospital branding appears in chatroom header.
- "Powered by Google Maps" displayed in the location scan step UI.
- Website integration link on landing page for mission and impact information.
- Bilingual interface (English/Hindi) with prominent language toggle.

---

## 12) Key Decisions & Rationale

- Pre-post moderation guarantees harmful content never lands in the room.
- International phone format ensures future scalability and consistency.
- Animated, calm UI elements are chosen to reduce stress during waiting.
- **Single active session** prevents security issues and ensures one user per account.
- **Bilingual support** (English/Hindi) improves accessibility for diverse user base.
- **Reply functionality** enhances conversation context and user engagement.
- **Relaxation Corner** provides stress-relief tools during waiting periods.
- **Privacy protection** blocks contact sharing (phone/email/URL) automatically.
- **Feedback collection** enables continuous improvement based on user experience.

---

For deeper implementation details, see:
- `app_docs/README.md` (full system overview)
- `app_docs/Implementation_Document.md` (implementation highlights)
*** End Patch

