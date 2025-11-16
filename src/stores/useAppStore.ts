import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session, Message, AppSettings, LocationState } from '@/lib/types';

interface AppState {
  // App mode
  appMode: 'companion' | 'hospital';
  setAppMode: (mode: AppState['appMode']) => void;

  // Session state
  session: Session | null;
  setSession: (session: Session | null) => void;
  
  // Location state
  location: LocationState;
  setLocation: (location: Partial<LocationState>) => void;
  
  // Chat state
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  
  // Sequential system responses
  userMessageCount: number;
  incrementUserMessageCount: () => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // UI state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  currentStep: 'landing' | 'mode-select' | 'location' | 'location-scan' | 'companion-auth' | 'disclaimer' | 'avatar-display' | 'chat' | 'relaxation' | 'settings' | 'hospital-form' | 'about' | 'privacy' | 'about-details';
  setCurrentStep: (step: AppState['currentStep']) => void;
  
  // OTP state
  otpPhone: string;
  setOtpPhone: (phone: string) => void;
  
  // Reset all state
  reset: () => void;
}

const initialLocation: LocationState = {
  permission: 'unknown',
  position: null,
  withinRadius: false,
  error: null,
};

const initialSettings: AppSettings = {
  largerText: false,
  reducedMotion: false,
  language: 'en',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Session
      appMode: 'companion',
      setAppMode: (mode) => set({ appMode: mode }),

      session: null,
      setSession: (session) => set({ session }),
      
      // Location
      location: initialLocation,
      setLocation: (locationUpdate) => 
        set((state) => ({
          location: { ...state.location, ...locationUpdate }
        })),
      
      // Chat
      messages: [],
      addMessage: (message) => 
        set((state) => ({
          messages: [...state.messages, message]
        })),
      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === id ? { ...msg, ...updates } : msg
          )
        })),
      clearMessages: () => set({ messages: [] }),
      
      // Sequential system responses
      userMessageCount: 0,
      incrementUserMessageCount: () => 
        set((state) => ({
          userMessageCount: state.userMessageCount + 1
        })),
      
      // Settings
      settings: initialSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates }
        })),
      
      // UI
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      
      currentStep: 'landing',
      setCurrentStep: (step) => set({ currentStep: step }),
      
      // OTP
      otpPhone: '',
      setOtpPhone: (phone) => set({ otpPhone: phone }),
      
      // Reset
      reset: () => set({
        appMode: 'companion',
        session: null,
        location: initialLocation,
        messages: [],
        currentStep: 'landing',
        otpPhone: '',
        isLoading: false,
        userMessageCount: 0,
      }),
    }),
    {
      name: 'anonymous-waiting-storage',
      partialize: (state) => ({
        settings: state.settings,
        // Don't persist sensitive session data
      }),
    }
  )
);