import { PageContainer } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Lock, MapPin, Feather } from 'lucide-react';

interface PrivacyTermsProps {
  onBack: () => void;
}

export function PrivacyTerms({ onBack }: PrivacyTermsProps) {
  return (
    <PageContainer className="bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute top-12 left-10 w-28 h-28 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute bottom-16 right-12 w-24 h-24 rounded-full bg-emerald-200/50 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-2xl mx-auto px-6 py-12 text-center space-y-10 relative"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
            Privacy & Terms
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Minimal data. Maximum care. Built for calming wait times.
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
            We collect only what is needed to keep the chat safe, relevant, and anchored to your hospital visit.
            Every element — from avatars to location checks — is opt-in, short-lived, and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Lock,
              title: 'No Personal IDs',
              body: 'Nicknames and avatars are randomly assigned. We never display or store personal identifiers.'
            },
            {
              icon: MapPin,
              title: 'Purposeful Location',
              body: 'Location is used one time to confirm you are within the hospital radius and is then discarded.'
            },
            {
              icon: Feather,
              title: 'Gentle Conduct',
              body: 'All messages must stay supportive and on-topic. Moderation blocks spam, advice, or harmful content.'
            }
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.35 }}
              className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md p-5 text-left shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <card.icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900">{card.title}</h3>
              <p className="text-sm text-muted-foreground">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          className="space-y-2 text-xs md:text-sm text-muted-foreground"
        >
          <p>We never share data with advertisers or third parties.</p>
          <p>All conversations are moderated for safety and relevance.</p>
          <p>For emergencies or medical advice, please reach hospital staff immediately.</p>
        </motion.div>

        <Button variant="ghost" className="mx-auto" onClick={onBack}>
          Back
        </Button>
      </motion.div>
    </PageContainer>
  );
}

