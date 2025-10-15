import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { findCompanionByMobile } from '@/lib/supabaseClient';

interface CompanionAuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CompanionAuth({ onBack, onSuccess }: CompanionAuthProps) {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    const { data, error } = await findCompanionByMobile(cleaned);
    setLoading(false);
    if (error) {
      setError('Error contacting server. Please try again.');
      return;
    }
    if (!data) {
      setError('No registration found for this number. Please contact hospital staff to register.');
      return;
    }
    onSuccess();
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Companion Verification</h1>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-soft rounded-full">
            <Smartphone size={24} className="text-primary" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-medium">Enter Your Mobile Number</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We use your registered number to verify you are a companion.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="tel"
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  if (cleaned.length <= 10) {
                    setMobile(cleaned);
                    setError('');
                  }
                }}
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>

            <Button
              variant="default"
              size="touch"
              onClick={handleSubmit}
              disabled={loading || mobile.replace(/\D/g, '').length !== 10}
              className="w-full"
            >
              {loading ? 'Checking...' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}


