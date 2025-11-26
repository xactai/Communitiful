import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, Smartphone, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { findCompanionByMobile, checkActiveSession } from '@/lib/supabaseClient';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/stores/useAppStore';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
] as const;

interface CompanionAuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CompanionAuth({ onBack, onSuccess }: CompanionAuthProps) {
  const { t } = useTranslation();
  const { setAuthenticatedMobile } = useAppStore();
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCountry = useMemo(
    () => COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0],
    [countryCode]
  );

  const handleSubmit = async () => {
    setError('');
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError(t('companionAuth.errorInvalid'));
      return;
    }

    setLoading(true);
    const formattedNumber = `${countryCode}${cleaned}`;
    
    // First, check if there's an active session for this mobile number
    const { data: activeSession, error: sessionError } = await checkActiveSession(formattedNumber);
    
    if (sessionError) {
      setLoading(false);
      setError(t('companionAuth.errorServer'));
      return;
    }

    if (activeSession) {
      setLoading(false);
      setError(t('companionAuth.errorActiveSession'));
      return;
    }

    // Verify companion exists in database
    const { data, error } = await findCompanionByMobile(formattedNumber, cleaned);
    setLoading(false);

    if (error) {
      setError(t('companionAuth.errorServer'));
      return;
    }

    if (!data) {
      setError(t('companionAuth.errorNotFound'));
      return;
    }

    // Store authenticated mobile number for later use
    setAuthenticatedMobile(formattedNumber);
    onSuccess();
  };

  return (
    <PageContainer className="relative bg-gradient-to-b from-white via-primary-soft/20 to-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="relative space-y-8 max-w-lg mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="border border-primary/20">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">{t('companionAuth.step')}</p>
            <h1 className="text-xl font-semibold">{t('companionAuth.title')}</h1>
          </div>
        </div>

        <div className="rounded-3xl border border-white/50 bg-white/80 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
              <Smartphone size={28} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t('companionAuth.enterNumber')}</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {t('companionAuth.privacyNote')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('companionAuth.mobileNumber')}</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="sm:max-w-[140px] bg-white/90">
                  <SelectValue>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span>{selectedCountry.code}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectGroup>
                    {COUNTRY_CODES.map(({ code, country, flag }) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{flag}</span>
                          <span>{country}</span>
                          <span className="text-muted-foreground text-xs">{code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                value={mobile}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  if (cleaned.length <= 10) {
                    setMobile(cleaned);
                    setError('');
                  }
                }}
                className={`flex-1 bg-white/90 ${error ? 'border-destructive' : ''}`}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 rounded-xl px-3 py-2">
              <ShieldCheck size={14} className="text-primary" />
              {t('companionAuth.anonymousNote')}
            </div>
          </div>

          <Button
            variant="default"
            size="touch"
            onClick={handleSubmit}
            disabled={loading || mobile.replace(/\D/g, '').length !== 10}
            className="w-full rounded-2xl text-base font-semibold shadow-[0_15px_35px_rgba(79,70,229,0.25)]"
          >
            {loading ? t('companionAuth.checking') : t('companionAuth.continue')}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}


