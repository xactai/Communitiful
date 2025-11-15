import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/AppLayout';
import { Building2, HeartHandshake } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface LandingProps {
  onStart: (mode: 'companion' | 'hospital') => void;
  onShowAbout: () => void;
  onShowPrivacy: () => void;
}

export function Landing({ onStart, onShowAbout, onShowPrivacy }: LandingProps) {
  const [hospitalMode, setHospitalMode] = useState(true);
  return (
    <PageContainer className="justify-center bg-gradient-to-b from-primary-soft to-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 p-8 rounded-lg bg-white/90 backdrop-blur-sm shadow-md border border-primary-light/30">
        
        {/* Brand Logo */}
        <div className="mb-6">
          <motion.img 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src="/images/Brand Logo.png" 
            alt="Brand Logo" 
            className="rounded-lg shadow-md mx-auto w-36 h-auto"
          />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Companions Anonymous
            </h1>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
            For every companion who waits — you’re not alone.”
            </p>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center flex-shrink-0 text-lg">
              <span role="img" aria-label="shielded chat">🛡️</span>
            </div>
            <div className="text-sm min-w-0">
              <div className="font-medium">Anonymous and Private</div>
              <div className="text-muted-foreground">No personal info required</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center flex-shrink-0 text-lg">
              <span role="img" aria-label="supportive circle">🤝</span>
            </div>
            <div className="text-sm min-w-0">
              <div className="font-medium">Connect with Others</div>
              <div className="text-muted-foreground">Share experiences safely</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🧘</span>
            </div>
            <div className="text-sm min-w-0">
              <div className="font-medium">Calming Resources</div>
              <div className="text-muted-foreground">Relaxation tools included</div>
            </div>
          </motion.div>
        </div>

        {/* Mode toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <Label htmlFor="mode-toggle" className="text-sm flex items-center gap-1">
            <HeartHandshake size={14} className="text-primary" /> Companion Mode
          </Label>
          
          <div 
            className="relative w-16 h-8 rounded-full bg-gray-200 cursor-pointer shadow-inner"
            onClick={() => setHospitalMode(!hospitalMode)}
            role="switch"
            aria-checked={hospitalMode}
            id="mode-toggle"
          >
            <motion.div 
              className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
              animate={{ 
                x: hospitalMode ? 32 : 0,
                backgroundColor: hospitalMode ? "#4f46e5" : "#ffffff"
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {hospitalMode ? 
                <Building2 size={14} className="text-white" /> : 
                <HeartHandshake size={14} className="text-primary" />
              }
            </motion.div>
          </div>
          
          <Label htmlFor="mode-toggle" className="text-sm flex items-center gap-1">
            <Building2 size={14} /> Hospital Mode
          </Label>
        </div>

        {/* Call to action */}
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="default" 
              size="touch" 
              onClick={() => onStart(hospitalMode ? 'hospital' : 'companion')}
              className="w-full max-w-xs bg-primary hover:bg-primary/90 shadow-md"
            >
              Get Started
            </Button>
          </motion.div>
          
          <div className="space-y-2 text-sm">
            <button 
              className="text-primary hover:underline"
              onClick={onShowAbout}
            >
              What is this?
            </button>
            
            <div className="text-muted-foreground">·</div>
            
            <button 
              className="text-primary hover:underline"
              onClick={onShowPrivacy}
            >
              Privacy & Terms
            </button>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}