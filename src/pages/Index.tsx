import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { LocationGuard } from '@/components/LocationGuard';
import { Landing } from '@/pages/Landing';
import { CompanionAuth } from '@/pages/CompanionAuth';
import { Disclaimer } from '@/pages/Disclaimer';
import { AvatarDisplay } from '@/pages/AvatarDisplay';
import { Chat } from '@/pages/Chat';
import { Relaxation } from '@/pages/Relaxation';
import { Settings } from '@/pages/Settings';
import { TEST_CLINIC, Session } from '@/lib/types';
import { generateNickname } from '@/lib/utils';
import { HospitalForm } from '@/pages/HospitalForm';
import { HospitalConfirmation } from '@/pages/HospitalConfirmation';
import { toast } from "@/components/ui/use-toast";
import { WhatIsThis } from '@/pages/WhatIsThis';
import { PrivacyTerms } from '@/pages/PrivacyTerms';
import { AboutCompanions } from '@/pages/AboutCompanions';
import { LocationScan } from '@/pages/LocationScan';

const Index = () => {
  const { 
    appMode,
    setAppMode,
    currentStep, 
    setCurrentStep, 
    session, 
    setSession, 
    reset 
  } = useAppStore();

  // Initialize or create session with auto-assigned avatar and nickname
  const createSession = () => {
    const randomAvatar = Math.floor(Math.random() * 8) + 1; // Random avatar 1-8
    const randomNickname = generateNickname();
    
    const newSession: Session = {
      id: crypto.randomUUID(),
      clinicId: TEST_CLINIC.id,
      nick: randomNickname,
      avatarId: randomAvatar.toString(),
      createdAt: new Date(),
      lastSeenAt: new Date(),
      onSite: true,
    };
    
    setSession(newSession);
    setCurrentStep('chat');
  };

  // Handle step navigation
  const handleStart = (mode: 'companion' | 'hospital') => {
    setAppMode(mode);
    if (mode === 'companion') {
      setCurrentStep('location-scan');
    } else {
      setCurrentStep('hospital-form');
    }
  };
  const handleCompanionAuthSuccess = () => setCurrentStep('disclaimer');
  const handleDisclaimerAccept = () => {
    createSession(); // Auto-create session with random avatar and nickname
    setCurrentStep('avatar-display'); // Show avatar display before chat
  };

  const handleAvatarDisplayContinue = () => {
    setCurrentStep('chat');
  };

  // Navigate back
  const handleBack = () => {
    switch (currentStep) {
      case 'otp':
        setCurrentStep('location');
        break;
      case 'disclaimer':
        setCurrentStep('otp');
        break;
      default:
        setCurrentStep('landing');
    }
  };

  // Reset to landing if no session
  useEffect(() => {
    if (currentStep === 'chat' && !session) {
      setCurrentStep('landing');
    }
  }, [currentStep, session, setCurrentStep]);

  // Render current step
  switch (currentStep) {
    case 'landing':
      return (
        <Landing 
          onStart={handleStart} 
          onShowAbout={() => setCurrentStep('about')} 
          onShowPrivacy={() => setCurrentStep('privacy')}
        />
      );
    
    case 'about':
      return (
        <WhatIsThis 
          onBack={() => setCurrentStep('landing')}
          onStart={() => handleStart('companion')}
        />
      );

    case 'privacy':
      return (
        <PrivacyTerms 
          onBack={() => setCurrentStep('landing')}
        />
      );

    case 'about-details':
      return (
        <AboutCompanions 
          onBack={() => setCurrentStep('settings')}
        />
      );
      
    case 'location':
      return (
        <LocationGuard onLocationVerified={handleLocationVerified}>
          <div>Location verified!</div>
        </LocationGuard>
      );
    
    case 'location-scan':
      return (
        <LocationScan onComplete={() => setCurrentStep('companion-auth')} />
      );
      
    case 'companion-auth':
      return (
        <CompanionAuth 
          onBack={handleBack}
          onSuccess={handleCompanionAuthSuccess}
        />
      );
      
    case 'disclaimer':
      return (
        <Disclaimer 
          onBack={handleBack}
          onAccept={handleDisclaimerAccept}
        />
      );
      
    case 'avatar-display':
      return session ? (
        <AvatarDisplay 
          avatarId={session.avatarId}
          nickname={session.nick}
          onContinue={handleAvatarDisplayContinue}
        />
      ) : null;
      
    case 'chat':
      return (
        <Chat 
          onOpenSettings={() => setCurrentStep('settings')}
          onOpenRelaxation={() => setCurrentStep('relaxation')}
        />
      );
      
    case 'relaxation':
      return (
        <Relaxation 
          onBack={() => setCurrentStep('chat')}
        />
      );
      
    case 'settings':
      return (
        <Settings 
          onBack={() => setCurrentStep('chat')}
          onLeaveRoom={() => {
            reset();
            setCurrentStep('landing');
          }}
        />
      );
      
    case 'hospital-form':
      return (
        <HospitalForm
          onBack={handleBack}
          onSuccess={() => setCurrentStep('hospital-confirmation')}
        />
      );
      
    case 'hospital-confirmation':
      return (
        <HospitalConfirmation
          onComplete={() => {
            setCurrentStep('landing');
            // Show toast message when redirected to landing page
            toast({
              title: "Registration Complete",
              description: "Sign in with Companion Mode to chat and relax ✨",
              duration: 5000,
            });
          }}
        />
      );
    default:
      return <Landing onStart={handleStart} />;
  }
};

export default Index;