// Utility functions for auto-filling form fields with random data

// Random patient names
const firstNames = [
  'Arun', 'Priya', 'Rahul', 'Neha', 'Vikram', 'Anjali', 'Sanjay', 'Meera', 
  'Rajesh', 'Sunita', 'Amit', 'Deepa', 'Kiran', 'Pooja', 'Vijay', 'Ananya'
];

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Reddy', 'Joshi', 'Nair',
  'Mehta', 'Verma', 'Rao', 'Malhotra', 'Iyer', 'Agarwal', 'Kapoor', 'Desai'
];

// Random locations/addresses
const locations = [
  'Indiranagar, Bangalore', 'Koramangala, Bangalore', 'HSR Layout, Bangalore',
  'Whitefield, Bangalore', 'JP Nagar, Bangalore', 'Malleshwaram, Bangalore',
  'Jayanagar, Bangalore', 'Bandra, Mumbai', 'Andheri, Mumbai', 'Powai, Mumbai',
  'Juhu, Mumbai', 'Worli, Mumbai', 'Vasant Kunj, Delhi', 'Hauz Khas, Delhi',
  'Connaught Place, Delhi', 'Dwarka, Delhi', 'Salt Lake, Kolkata', 'Park Street, Kolkata'
];

// Random purposes of visit
const purposes = ['consultation', 'surgery', 'emergency', 'follow-up', 'diagnosis', 'other'];

// Random departments
const departments = ['cardiology', 'orthopedics', 'neurology', 'oncology', 'pediatrics', 'general', 'emergency', 'other'];

// Random relationships
const relationships = ['spouse', 'parent', 'child', 'sibling', 'friend', 'relative', 'caregiver', 'other'];

// Helper function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a random 10-digit phone number
const generateRandomPhoneNumber = (): string => {
  let number = '9'; // Start with 9 to ensure it looks like a mobile number
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
};

// Generate random patient data
export const generateRandomPatientData = () => {
  return {
    name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
    contactNumber: generateRandomPhoneNumber(),
    purposeOfVisit: getRandomItem(purposes),
    department: getRandomItem(departments),
    location: getRandomItem(locations)
  };
};

// Generate random companion data
export const generateRandomCompanionData = () => {
  return {
    name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
    relationship: getRandomItem(relationships),
    number: generateRandomPhoneNumber(),
    location: getRandomItem(locations)
  };
};

// Typing animation utility
export interface TypeOptions {
  text: string;
  onUpdate: (text: string) => void;
  onComplete?: () => void;
  speed?: number; // milliseconds per character
  initialDelay?: number; // milliseconds before starting
}

export const typeText = ({ 
  text, 
  onUpdate, 
  onComplete, 
  speed = 50, 
  initialDelay = 0 
}: TypeOptions): { cancel: () => void } => {
  let currentIndex = 0;
  let timer: NodeJS.Timeout | null = null;
  
  const type = () => {
    if (currentIndex < text.length) {
      const newText = text.substring(0, currentIndex + 1);
      onUpdate(newText);
      currentIndex++;
      
      // Random variation in typing speed for realism
      const variation = Math.random() * 30 - 15; // +/- 15ms
      timer = setTimeout(type, speed + variation);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  // Start typing after initial delay
  const startTimer = setTimeout(() => {
    type();
  }, initialDelay);
  
  // Return a function to cancel the animation if needed
  return {
    cancel: () => {
      if (timer) clearTimeout(timer);
      if (startTimer) clearTimeout(startTimer);
    }
  };
};