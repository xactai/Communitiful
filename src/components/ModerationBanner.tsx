import { useState, useEffect } from 'react';

interface ModerationBannerProps {
  visible: boolean;
  message?: string;
  onClose?: () => void;
  type?: 'block' | 'warn' | 'safety';
  suggestions?: string[];
}

export function ModerationBanner({ 
  visible, 
  message = "Moderation Notice", 
  onClose,
  type = 'warn',
  suggestions = []
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

  // Determine styling based on type
  const getBannerStyle = () => {
    switch (type) {
      case 'block':
        return 'bg-red-600 text-white animate-pulse';
      case 'warn':
        return 'bg-amber-500 text-white';
      case 'safety':
        return 'bg-blue-600 text-white animate-pulse';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'block':
        return '🚫';
      case 'warn':
        return '⚠️';
      case 'safety':
        return '🆘';
      default:
        return 'ℹ️';
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className={`${getBannerStyle()} font-medium py-3 px-6 rounded-b-md shadow-lg max-w-md mx-4`}>
        <div className="flex items-center justify-center">
          <span className="mr-2">{getIcon()}</span>
          <span className="text-center">{message}</span>
        </div>
        {suggestions.length > 0 && (
          <div className="mt-2 text-sm opacity-90">
            <div className="font-semibold mb-1">Suggestions:</div>
            <ul className="list-disc list-inside space-y-1">
              {suggestions.slice(0, 2).map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}