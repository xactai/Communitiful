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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="bg-red-600 text-white font-bold py-2 px-4 rounded-b-md shadow-md animate-pulse">
        {message}
      </div>
    </div>
  );
}