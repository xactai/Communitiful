import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Haversine formula to calculate distance between two coordinates
export function metersBetween(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const sLat = toRad(aLat);
  const sLat2 = toRad(bLat);
  
  const h = 
    Math.sin(dLat / 2) ** 2 +
    Math.cos(sLat) * Math.cos(sLat2) * Math.sin(dLng / 2) ** 2;
  
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Generate random nickname
export function generateNickname(): string {
  const adjectives = [
    'Calm', 'Gentle', 'Quiet', 'Peaceful', 'Serene', 'Still', 'Soft', 'Light',
    'Warm', 'Kind', 'Safe', 'Steady', 'Clear', 'Bright', 'Fresh', 'Cool'
  ];
  
  const nouns = [
    'Leaf', 'Cloud', 'Star', 'Moon', 'River', 'Stone', 'Bird', 'Wave',
    'Tree', 'Dawn', 'Rain', 'Wind', 'Sun', 'Sky', 'Lake', 'Hill'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 99) + 1;
  
  return `${adjective}-${noun}-${number}`;
}

// Rate limiting helper
export class RateLimiter {
  private timestamps: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canProceed(): boolean {
    const now = Date.now();
    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter(ts => now - ts < this.windowMs);
    
    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return true;
    }
    
    return false;
  }

  getTimeUntilReset(): number {
    if (this.timestamps.length === 0) return 0;
    const oldestTimestamp = Math.min(...this.timestamps);
    return Math.max(0, this.windowMs - (Date.now() - oldestTimestamp));
  }
}

// Format time helpers
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 1) return 'now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// Pre-filter for common patterns to block
export function preFilterMessage(text: string): {
  allowed: boolean;
  reason?: string;
  cleanText?: string;
} {
  const lowerText = text.toLowerCase();
  
  // Block obvious patterns
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const urlPattern = /https?:\/\/[^\s]+/;
  
  if (phonePattern.test(text)) {
    return { allowed: false, reason: 'Phone numbers are not allowed for privacy' };
  }
  
  if (emailPattern.test(text)) {
    return { allowed: false, reason: 'Email addresses are not allowed for privacy' };
  }
  
  if (urlPattern.test(text)) {
    return { allowed: false, reason: 'URLs are not allowed in this space' };
  }
  
  // Block obvious profanity (basic list)
  const profanityWords = ['fuck', 'shit', 'damn', 'bitch', 'asshole'];
  const containsProfanity = profanityWords.some(word => 
    lowerText.includes(word)
  );
  
  if (containsProfanity) {
    return { allowed: false, reason: 'Please keep language appropriate for all users' };
  }
  
  // Check for empty or too short
  if (text.trim().length < 1) {
    return { allowed: false, reason: 'Message cannot be empty' };
  }
  
  if (text.trim().length > 500) {
    return { allowed: false, reason: 'Message is too long (max 500 characters)' };
  }
  
  return { allowed: true, cleanText: text.trim() };
}