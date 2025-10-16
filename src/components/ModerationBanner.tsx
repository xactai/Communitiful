import { useState, useEffect } from 'react';

interface ModerationBannerProps {
  visible: boolean;
  message?: string;
  onClose?: () => void;
}

export function ModerationBanner({ 
  visible, 
  message = "Moderation Failed", 
  onClose 
}: ModerationBannerProps) {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!isVisible) return null;

  // Determine if this is a safety alert or moderation notice
  const isSafetyAlert = message?.includes("SAFETY_ALERT");
  const displayMessage = isSafetyAlert ? message.replace("SAFETY_ALERT:", "") : message;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className={`${isSafetyAlert ? 'bg-amber-500' : 'bg-blue-600'} text-white font-medium py-2 px-4 rounded-b-md shadow-md ${isSafetyAlert ? 'animate-pulse' : ''}`}>
        {isSafetyAlert && <span className="mr-1">⚠️</span>}
        {displayMessage}
      </div>
    </div>
  );
}