import { PageContainer } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Sparkles, HeartHandshake } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface AboutCompanionsProps {
  onBack: () => void;
}

export function AboutCompanions({ onBack }: AboutCompanionsProps) {
  const { t } = useTranslation();
  
  const pillars = [
    {
      title: t('aboutCompanions.pillar1Title'),
      icon: Users,
      body: t('aboutCompanions.pillar1Body')
    },
    {
      title: t('aboutCompanions.pillar2Title'),
      icon: HeartHandshake,
      body: t('aboutCompanions.pillar2Body')
    },
    {
      title: t('aboutCompanions.pillar3Title'),
      icon: Sparkles,
      body: t('aboutCompanions.pillar3Body')
    }
  ];
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
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">{t('aboutCompanions.about')}</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">{t('aboutCompanions.title')}</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              {t('aboutCompanions.description')}
            </p>
          </div>
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            {t('aboutCompanions.back')}
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
          <p className="text-sm uppercase tracking-[0.35em] text-primary">{t('aboutCompanions.promiseTitle')}</p>
          <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
            <li>{t('aboutCompanions.promise1')}</li>
            <li>{t('aboutCompanions.promise2')}</li>
            <li>{t('aboutCompanions.promise3')}</li>
            <li>{t('aboutCompanions.promise4')}</li>
          </ul>
        </div>
      </motion.div>
    </PageContainer>
  );
}

