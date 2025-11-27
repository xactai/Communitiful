export interface Clinic {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
}

export interface Session {
  id: string;
  clinicId: string;
  nick: string;
  avatarId: string;
  createdAt: Date;
  lastSeenAt: Date;
  onSite: boolean;
}

export interface Message {
  id: string;
  clinicId: string;
  sessionId: string;
  authorType: "user" | "agent" | "system" | "companion";
  text: string;
  createdAt: Date;
  moderation: {
    status: "pending" | "allowed" | "blocked" | "flagged";
    reason?: string;
  };
  companionIdentity?: {
    name: string;
    emoji: string;
  };
  replyTo?: {
    messageId: string;
    text: string;
    senderName: string;
    senderAvatar?: string;
  };
  reactions?: {
    [emoji: string]: {
      count: number;
      users: string[]; // sessionIds of users who reacted
    };
  };
}

export interface Announcement {
  id: string;
  clinicId: string;
  text: string;
  createdAt: Date;
}

export interface LocationState {
  permission: "unknown" | "granted" | "denied";
  position: GeolocationPosition | null;
  withinRadius: boolean;
  error: string | null;
}

export interface AppSettings {
  largerText: boolean;
  reducedMotion: boolean;
  language: string;
}

// Supabase domain models
export interface Patient {
  patient_id: string;
  name: string;
  patient_contact_number: string;
  purpose_of_visit: string | null;
  department: string | null;
  location: string | null;
  created_at: string; // ISO
}

export interface Companion {
  companion_id: string;
  patient_id: string;
  name: string;
  relationship: string;
  number: string;
  location: string | null;
  created_at: string; // ISO
}

export const AVATARS = [
  { id: '1', name: 'Gentle Circle', emoji: '🔵' },
  { id: '2', name: 'Calm Square', emoji: '🟢' },
  { id: '3', name: 'Peaceful Triangle', emoji: '🔺' },
  { id: '4', name: 'Serene Star', emoji: '⭐' },
  { id: '5', name: 'Quiet Moon', emoji: '🌙' },
  { id: '6', name: 'Still Heart', emoji: '💙' },
  { id: '7', name: 'Soft Leaf', emoji: '🍃' },
  { id: '8', name: 'Light Cloud', emoji: '☁️' },
];

export const TEST_CLINIC: Clinic = {
  id: 'test-clinic-1',
  name: 'Apollo Hospital',
  lat: 12.919837049875678, // Bangalore coordinates
  lng: 77.64497976254331,
  radiusMeters: 1000000, // 1000 km radius
};

export const OTP_TEST_CODE = '123456';