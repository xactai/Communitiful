import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const { settings } = useAppStore();

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    if (settings.largerText) {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }

    if (settings.reducedMotion) {
      root.style.setProperty('--transition-smooth', 'none');
      root.style.setProperty('--transition-quick', 'none');
    } else {
      root.style.removeProperty('--transition-smooth');
      root.style.removeProperty('--transition-quick');
    }
  }, [settings]);

  return (
    <div 
      className={cn(
        "min-h-screen bg-background text-foreground",
        "flex flex-col",
        "safe-area-inset", // For mobile safe areas
        settings.largerText && "text-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

// Safe area component for mobile
export function SafeArea({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn("px-safe py-safe", className)}>
      {children}
    </div>
  );
}

// Page container with consistent spacing
export function PageContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      "flex-1 flex flex-col",
      "w-full max-w-md mx-auto", // Mobile-first max width
      "sm:max-w-lg md:max-w-2xl lg:max-w-4xl", // Responsive breakpoints
      "min-h-screen", // Ensure full height on mobile
      className
    )}>
      <SafeArea>
        {children}
      </SafeArea>
    </div>
  );
}