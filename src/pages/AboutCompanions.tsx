import { PageContainer } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Sparkles, HeartHandshake } from 'lucide-react';

interface AboutCompanionsProps {
  onBack: () => void;
}

const pillars = [
  {
    title: 'Human-first Design',
    icon: Users,
    body: 'Created for caregivers spending long hours in hospital waiting areas. Every feature starts with empathy.'
  },
  {
    title: 'Safety & Privacy',
    icon: HeartHandshake,
    body: 'Anonymous identities, live moderation, and zero advertising keep the space respectful and calm.'
  },
  {
    title: 'Gentle Support',
    icon: Sparkles,
    body: 'From breathing cues to curated check-ins, we focus on light-touch prompts that soften stressful waits.'
  }
];

export function AboutCompanions({ onBack }: AboutCompanionsProps) {
  return (
    <PageContainer className="bg-gradient-to-b from-[#eef2ff] via-white to-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 py-12 space-y-10"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">About</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">Why Companions Anonymous Exists</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Hospitals care for patients. We care for the people who wait — quietly, anxiously, and often alone.
              This project is our promise to offer company, calm, and community inside every waiting hall.
            </p>
          </div>
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map(({ title, icon: Icon, body }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-sm p-5 shadow-[0_15px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-primary">What we promise</p>
          <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
            <li>No personal data collection beyond real-time verification</li>
            <li>Location is only checked to ensure you are inside the partner hospital</li>
            <li>All conversations auto-expire; nothing is public or permanent</li>
            <li>Emergency prompts route you to hospital staff instantly</li>
          </ul>
        </div>
      </motion.div>
    </PageContainer>
  );
}

