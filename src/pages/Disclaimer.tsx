import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PageContainer } from '@/components/AppLayout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, AlertTriangle, Users, MessageCircle, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface DisclaimerProps {
  onBack: () => void;
  onAccept: () => void;
}

export function Disclaimer({ onBack, onAccept }: DisclaimerProps) {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  return (
    <TooltipProvider>
      <PageContainer className="bg-gradient-to-b from-[#eef2ff] via-white to-white">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="focus:ring-2 focus:ring-primary/20"
            >
              <ArrowLeft size={20} />
            </Button>
          </motion.div>
          <div>
            <motion.p 
              className="text-xs uppercase tracking-[0.3em] text-primary"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.3 }}
            >
              {t('disclaimer.step')}
            </motion.p>
            <motion.h1 
              className="text-xl font-semibold text-primary"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {t('disclaimer.title')}
            </motion.h1>
          </div>
        </motion.div>

        {/* Main content container with animation */}
        <motion.div 
          className="max-w-lg mx-auto text-center space-y-8 rounded-2xl border border-primary/20 bg-white/90 backdrop-blur-sm shadow-[0_18px_50px_rgba(15,23,42,0.08)] p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Central visual welcome */}
          <motion.div 
            className="bg-primary/10 border border-primary/20 rounded-xl p-6 shadow-inner"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <motion.div 
              className="flex justify-center items-center bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 shadow-inner text-3xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span role="img" aria-label="warm welcome">🤗</span>
            </motion.div>
            <motion.h2 
              className="text-lg font-semibold text-primary mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {t('disclaimer.welcome')}
            </motion.h2>
            <motion.p 
              className="text-sm text-foreground leading-relaxed"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {t('disclaimer.welcomeDesc').split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </motion.p>
          </motion.div>

          {/* Visual guidelines with tooltips */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="bg-primary/10 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-primary/15 transition-colors shadow-md"
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-white/70 text-xl flex items-center justify-center shadow">
                    <span role="img" aria-label="shielded chat">🛡️</span>
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm">{t('disclaimer.anonymousSafe')}</h3>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-48">
                  {t('disclaimer.anonymousSafeDesc')}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="bg-accent/30 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-accent/40 transition-colors shadow-md"
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-white/70 text-xl flex items-center justify-center shadow">
                    <span role="img" aria-label="supportive hands">🤝</span>
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm">{t('disclaimer.supportiveSpace')}</h3>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-48">
                  {t('disclaimer.supportiveSpaceDesc')}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="bg-info/10 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-info/15 transition-colors shadow-md"
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-white/70 text-xl flex items-center justify-center shadow">
                    <span role="img" aria-label="chat bubble">💬</span>
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm">{t('disclaimer.experienceOnly')}</h3>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-48">
                  {t('disclaimer.experienceOnlyDesc')}
                </p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          {/* Quick rules */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-1.5 cursor-pointer bg-white/90 border border-primary/20 text-slate-700 px-3.5 py-1.5 rounded-full shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Users size={12} className="text-primary" />
                  <span>{t('disclaimer.beRespectful')}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{t('disclaimer.beRespectfulDesc')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-1.5 cursor-pointer bg-white/90 border border-primary/20 text-slate-700 px-3.5 py-1.5 rounded-full shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Clock size={12} className="text-primary" />
                  <span>{t('disclaimer.shareWaiting')}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{t('disclaimer.shareWaitingDesc')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-1.5 cursor-pointer bg-white/90 border border-primary/20 text-slate-700 px-3.5 py-1.5 rounded-full shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <AlertTriangle size={12} className="text-primary" />
                  <span>{t('disclaimer.noMedicalAdvice')}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{t('disclaimer.noMedicalAdviceDesc')}</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          {/* Acceptance */}
          <motion.div 
            className="space-y-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <motion.div 
              className="flex items-start gap-3 justify-center"
              whileHover={{ scale: 1.01 }}
            >
              <Checkbox
                id="accept"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus:ring-2 focus:ring-primary/20"
              />
              <label
                htmlFor="accept"
                className="text-sm leading-relaxed cursor-pointer max-w-sm text-left"
              >
                {t('disclaimer.acceptText')}
              </label>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="default"
                size="touch"
                onClick={onAccept}
                disabled={!accepted}
                className="w-full max-w-sm rounded-2xl text-base font-semibold shadow-[0_15px_35px_rgba(79,70,229,0.25)] hover:shadow-lg focus:ring-2 focus:ring-primary/20"
              >
                {t('disclaimer.continue')}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </PageContainer>
    </TooltipProvider>
  );
}