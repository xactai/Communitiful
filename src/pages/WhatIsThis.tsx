import { PageContainer } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MessageCircleHeart, ShieldCheck, Sparkles } from 'lucide-react';

interface WhatIsThisProps {
  onBack: () => void;
  onStart: () => void;
}

const featureCards = [
  {
    icon: ShieldCheck,
    title: 'Anonymous Sanctuary',
    description: 'Every nickname and avatar is randomized, keeping your identity private while you share feelings openly.'
  },
  {
    icon: MessageCircleHeart,
    title: 'Supportive Companions',
    description: 'A moderated chat where every message is screened for warmth, empathy, and hospital-waiting relevance.'
  },
  {
    icon: Sparkles,
    title: 'Calming Rituals',
    description: 'In-app breathing guides and grounding prompts help you stay steady while you wait.'
  }
];

export function WhatIsThis({ onBack, onStart }: WhatIsThisProps) {
  return (
    <PageContainer className="bg-gradient-to-b from-[#eef2ff] via-white to-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-6 py-12 text-center space-y-10"
      >
        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 8 }}
            className="absolute top-10 left-8 w-32 h-32 bg-primary/10 blur-3xl rounded-full"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="absolute bottom-10 right-6 w-24 h-24 bg-[#f0abfc]/30 blur-3xl rounded-full"
          />
        </div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-4 relative"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">
            Companions Anonymous
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-snug">
            A gentle, anonymous space for every caregiver waiting outside a ward.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            When you tap “What is this?”, we want you to feel the calm you deserve.
            Everything inside the app is designed to keep conversations private, compassionate,
            and grounded in the reality of hospital waiting rooms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)]"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <card.icon size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="space-y-3"
        >
          <p className="text-sm text-muted-foreground">
            Moderated by real-time AI safety checks, geo-fenced to your hospital, and crafted with empathy-first design.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="default" size="lg" className="w-full sm:w-auto" onClick={onStart}>
              Enter Companion Space
            </Button>
            <Button variant="ghost" size="lg" className="w-full sm:w-auto" onClick={onBack}>
              Back
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}

