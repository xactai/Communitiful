import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { Radar, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationScanProps {
  onComplete: () => void;
}

export function LocationScan({ onComplete }: LocationScanProps) {
  const [phase, setPhase] = useState<'scanning' | 'passed'>('scanning');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('passed'), 4400);
    const t2 = setTimeout(() => onComplete(), 6800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <PageContainer className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eef2ff] via-white to-white">
      {/* soft orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, 18, 0] }}
          transition={{ repeat: Infinity, duration: 14 }}
          className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full"
        />
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          className="absolute bottom-10 right-6 w-32 h-32 bg-emerald-200/50 blur-3xl rounded-full"
        />
      </div>

      <div className="relative max-w-md mx-auto mt-20 px-6 text-center space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Access Check</p>
          <h1 className="text-2xl font-semibold text-slate-900">Verifying On-site Presence</h1>
          <p className="text-sm text-muted-foreground">
            Access is limited to companions inside partner hospital premises.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-white/80 backdrop-blur-sm p-6 shadow-[0_15px_45px_rgba(15,23,42,0.08)]">
          {phase === 'scanning' ? (
            <div className="space-y-6">
              <motion.div
                className="mx-auto w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              >
                <Radar className="text-primary" size={28} />
              </motion.div>
              <div className="relative h-10 rounded-md overflow-hidden bg-primary/5 border border-primary/20">
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-primary/20"
                  initial={{ x: '-30%' }}
                  animate={{ x: ['-30%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                  style={{ filter: 'blur(2px)' }}
                />
                <div className="absolute inset-0 grid grid-cols-12 opacity-20">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border-r border-primary/30" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Scanning location…</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="text-lg font-semibold text-emerald-700">Location check passed</h2>
              <p className="text-sm text-muted-foreground">You’re within hospital premises.</p>
              <Button variant="calm" size="touch" className="mt-2" onClick={onComplete}>
                Continue
              </Button>
            </motion.div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          We never store your precise location. This one-time check is used only for access.
        </p>

        {/* Maps credit */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Powered by</span>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-muted bg-white/70 backdrop-blur-sm">
            <MapPin size={12} className="text-[#34A853]" />
            <span className="text-xs font-medium text-slate-700">Google Maps</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

