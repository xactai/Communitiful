# Leadership Flow Diagrams — Companions Anonymous

This document summarizes key user journeys and system flows for leadership review. Diagrams use Mermaid for clarity and can be previewed in Markdown viewers that support Mermaid.

---

## 1) Overview — Modes and Core Surfaces

```mermaid
flowchart LR
  A[Landing] -->|Companion Mode| B(Location Scan)
  A -->|Hospital Mode| H(Hospital Registration)

  subgraph Companion Journey
    B --> C(Companion Auth)
    C --> D(Disclaimer)
    D --> E(Avatar Display)
    E --> F(Chatroom)
  end

  subgraph Hospital Desk
    H --> I[Supabase: patients]
    H --> J[Supabase: companions]
  end

  F <-- Realtime --> K[Supabase: messages]
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

## 4) Companion Verification — Authentication

```mermaid
sequenceDiagram
  participant U as User
  participant App as App (Client)
  participant DB as Supabase

  U->>App: Enter phone (+CC + local)
  App->>DB: companions.number IN [formatted, legacy 10-digit]
  DB-->>App: Match or No match
  alt match
    App-->>U: Proceed to Disclaimer
  else no match
    App-->>U: Not found (contact desk)
  end
```

---

## 5) Disclaimer → Identity → Chatroom

```mermaid
flowchart LR
  A[Disclaimer (no medical advice)] --> B[Anonymous Identity]
  B -->|nickname + avatar| C[Chatroom]
```

Avatar:
- Session assigns an emoji-based avatar and nickname (non-editable per session).

---

## 6) Message Lifecycle with Moderation

```mermaid
sequenceDiagram
  participant U as User
  participant App as Client
  participant Mod as Gemini API
  participant RT as Supabase Realtime

  U->>App: Type & Send Message
  App->>Mod: Pre-post moderation request
  alt Allowed
    Mod-->>App: { allowed: true }
    App->>RT: Insert message (status: allowed)
    RT-->>App: Realtime broadcast
    App-->>U: Message visible
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
  A --> C[About Companions Anonymous]

  B -->|read-only| A
  C -->|read-only| A
```

Notes:
- Settings navigates to Privacy & Terms or About Companions pages (read-only).

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
  }
```

---

## 10) Error & Fallback Scenarios

```mermaid
flowchart TD
  A[Moderation API Error] --> B[Log + allow message cautiously]
  C[Realtime DB Error] --> D[Fallback to local shared chat]
  E[Auth No Match] --> F[Inform user to register at desk]
```

---

## 11) Branding & Partner Context

- Apollo Hospital branding appears in chatroom header.
- “Powered by Google Maps” displayed in the location scan step UI.

---

## 12) Key Decisions & Rationale

- Pre-post moderation guarantees harmful content never lands in the room.
- International phone format ensures future scalability and consistency.
- Animated, calm UI elements are chosen to reduce stress during waiting.

---

For deeper implementation details, see:
- `app_docs/README.md` (full system overview)
- `app_docs/Implementation_Document.md` (implementation highlights)
*** End Patch

