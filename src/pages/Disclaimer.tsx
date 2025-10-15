import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PageContainer } from '@/components/AppLayout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, AlertTriangle, Shield, Users, Heart, MessageCircle, Clock, Stethoscope } from 'lucide-react';

interface DisclaimerProps {
  onBack: () => void;
  onAccept: () => void;
}

export function Disclaimer({ onBack, onAccept }: DisclaimerProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <TooltipProvider>
      <PageContainer>
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
          <motion.h1 
            className="text-xl font-semibold flex items-center gap-2 text-primary"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Stethoscope size={18} className="text-primary" />
            Important Information
          </motion.h1>
        </motion.div>

        {/* Main content container with animation */}
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Central visual welcome */}
          <motion.div 
            className="bg-primary/10 border border-primary/20 rounded-xl p-6 shadow-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <motion.div 
              className="flex justify-center items-center bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 shadow-inner"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Heart size={32} className="text-primary" />
            </motion.div>
            <motion.h2 
              className="text-lg font-semibold text-primary mb-2 flex items-center justify-center gap-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Heart size={16} className="text-primary" />
              Welcome, Friend
              <Heart size={16} className="text-primary" />
            </motion.h2>
            <motion.p 
              className="text-sm text-foreground leading-relaxed"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              We're glad you're here. This space is created for companions like you.<br />
              Share your journey and connect with others in similar situations.
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
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shield size={24} className="text-primary mx-auto mb-2 sm:mb-3 sm:w-7 sm:h-7" />
                  <h3 className="font-medium text-xs sm:text-sm">Anonymous & Safe</h3>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-48">
                  No personal information is shared. All messages are moderated for safety.
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="bg-accent/30 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-accent/40 transition-colors shadow-md"
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart size={24} className="text-accent-foreground mx-auto mb-2 sm:mb-3 sm:w-7 sm:h-7" />
                  <h3 className="font-medium text-xs sm:text-sm">Supportive Space</h3>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-48">
                  Share your waiting experience and offer emotional support to others.
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="bg-info/10 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-info/15 transition-colors shadow-md"
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Stethoscope size={24} className="text-info mx-auto mb-2 sm:mb-3 sm:w-7 sm:h-7" />
                  <h3 className="font-medium text-xs sm:text-sm">Experience Only</h3>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-48">
                  Focus on sharing experiences, not medical advice or personal details.
                </p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          {/* Quick rules */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-1 cursor-pointer bg-primary/5 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--primary), 0.1)" }}
                >
                  <Users size={12} className="text-primary" />
                  <span>Be Respectful</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Keep conversations supportive and kind</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-1 cursor-pointer bg-primary/5 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--primary), 0.1)" }}
                >
                  <Clock size={12} className="text-primary" />
                  <span>Share Waiting</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Talk about your waiting experience</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-1 cursor-pointer bg-primary/5 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--primary), 0.1)" }}
                >
                  <AlertTriangle size={12} className="text-primary" />
                  <span>No Medical Advice</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Don't give or ask for medical advice</p>
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
                className="text-sm leading-relaxed cursor-pointer max-w-sm text-left flex items-start gap-1"
              >
                <Heart size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span>I understand this is for sharing experiences only, not medical advice.</span>
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
                className="w-full max-w-sm shadow-md hover:shadow-lg flex items-center gap-2 focus:ring-2 focus:ring-primary/20"
              >
                <Heart size={16} className={accepted ? "text-primary-foreground" : "text-muted"} />
                Continue
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </PageContainer>
    </TooltipProvider>
  );
}