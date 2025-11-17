import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/AppLayout';
import { Building2, HeartHandshake, Languages } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';

interface LandingProps {
  onStart: (mode: 'companion' | 'hospital') => void;
  onShowAbout: () => void;
  onShowPrivacy: () => void;
}

export function Landing({ onStart, onShowAbout, onShowPrivacy }: LandingProps) {
  const [hospitalMode, setHospitalMode] = useState(true);
  const { t, language } = useTranslation();
  const { updateSettings } = useAppStore();
  
  const toggleLanguage = () => {
    updateSettings({ language: language === 'en' ? 'hi' : 'en' });
  };
  
  return (
    <PageContainer className="justify-center bg-landing-gradient relative overflow-hidden">
      {/* Decorative Graffiti Elements - Healthcare/Companionship Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating medical/companionship symbols */}
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-5"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ❤️
        </motion.div>
        <motion.div
          className="absolute top-40 right-16 text-5xl opacity-[0.04]"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          🤝
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 text-4xl opacity-5"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🕊️
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-24 text-5xl opacity-[0.04]"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        >
          💚
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-8 text-3xl opacity-[0.03]"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 4, 0]
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
        >
          🧘
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-12 text-4xl opacity-[0.04]"
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, -4, 0]
          }}
          transition={{ 
            duration: 7.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        >
          🌿
        </motion.div>
        
        {/* Abstract shapes - medical cross inspired */}
        <motion.div
          className="absolute top-16 right-1/4 w-32 h-32 border-2 border-primary/5 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-16 left-1/4 w-24 h-24 border-2 border-accent/5 rounded-full"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.07, 0.05]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Language Toggle - Prominently placed at top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 flex justify-center"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="bg-white/90 backdrop-blur-sm border-primary/30 shadow-sm hover:bg-primary/5 hover:border-primary/50 transition-all"
        >
          <Languages size={16} className="mr-2" />
          <span className="font-medium">{language === 'en' ? 'English' : 'हिंदी'}</span>
          <span className="ml-2 text-xs opacity-70">⇄</span>
        </Button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-8 p-8 rounded-lg bg-white/90 backdrop-blur-sm shadow-md border border-primary-light/30">
        
        {/* Brand Logo */}
        <div className="mb-6">
          <motion.img 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src="/images/Brand Logo.png" 
            alt="Brand Logo" 
            className="rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15),0_8px_30px_rgba(79,70,229,0.2)] mx-auto w-36 h-auto logo-pulse"
          />
          {/* Animated divider */}
          <div className="relative mx-auto mt-4 h-1.5 max-w-xs rounded-full overflow-hidden bg-primary/10 border border-primary/20">
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-primary/30"
              initial={{ x: '-30%' }}
              animate={{ x: ['-30%', '110%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ filter: 'blur(1px)' }}
            />
          </div>
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
              {t('landing.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              {t('landing.subtitle')}
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
            <motion.div 
              className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center flex-shrink-0 text-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            >
              <span role="img" aria-label="shielded chat">🛡️</span>
            </motion.div>
            <div className="text-sm min-w-0">
              <div className="font-medium">{t('landing.feature1Title')}</div>
              <div className="text-muted-foreground">{t('landing.feature1Desc')}</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-3 text-left"
          >
            <motion.div 
              className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center flex-shrink-0 text-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            >
              <span role="img" aria-label="supportive circle">🤝</span>
            </motion.div>
            <div className="text-sm min-w-0">
              <div className="font-medium">{t('landing.feature2Title')}</div>
              <div className="text-muted-foreground">{t('landing.feature2Desc')}</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-3 text-left"
          >
            <motion.div 
              className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            >
              <span className="text-lg">🧘</span>
            </motion.div>
            <div className="text-sm min-w-0">
              <div className="font-medium">{t('landing.feature3Title')}</div>
              <div className="text-muted-foreground">{t('landing.feature3Desc')}</div>
            </div>
          </motion.div>
        </div>

        {/* Mode toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <Label htmlFor="mode-toggle" className="text-sm flex items-center gap-1">
            <HeartHandshake size={14} className="text-primary" /> {t('landing.companionMode')}
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
            <Building2 size={14} /> {t('landing.hospitalMode')}
          </Label>
        </div>

        {/* Call to action */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="inline-block"
          >
            <div className="inline-block animate-soft-bounce-in">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="default" 
                  size="touch" 
                  onClick={() => onStart(hospitalMode ? 'hospital' : 'companion')}
                  className="w-full max-w-xs bg-primary hover:bg-primary/90 shadow-md"
                >
                  {t('landing.getStarted')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="space-y-2 text-sm">
            <button 
              className="text-primary hover:underline"
              onClick={onShowAbout}
            >
              {t('landing.whatIsThis')}
            </button>
            
            <div className="text-muted-foreground">·</div>
            
            <button 
              className="text-primary hover:underline"
              onClick={onShowPrivacy}
            >
              {t('landing.privacyTerms')}
            </button>
          </div>
        </div>
      </motion.div>
      <div className="mt-6 text-center text-xs text-muted-foreground">
        {t('landing.tagline')}
      </div>
    </PageContainer>
  );
}