import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/AppLayout';
import { Loader2 } from 'lucide-react';

interface HospitalConfirmationProps {
  onComplete: () => void;
}

export function HospitalConfirmation({ onComplete }: HospitalConfirmationProps) {
  const [status, setStatus] = useState<'qr' | 'scanning' | 'success'>('qr');

  useEffect(() => {
    // After 3 seconds, show scanning message
    const scanningTimer = setTimeout(() => {
      setStatus('scanning');
    }, 3000);

    // After 5 seconds (3+2), show success message
    const successTimer = setTimeout(() => {
      setStatus('success');
    }, 5000);

    // After 6 seconds (3+2+1), redirect to landing page
    const redirectTimer = setTimeout(() => {
      onComplete();
    }, 6000);

    // Clean up timers
    return () => {
      clearTimeout(scanningTimer);
      clearTimeout(successTimer);
      clearTimeout(redirectTimer);
    };
  }, [onComplete]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        {/* QR Code */}
        <div className="mb-8 border-4 border-primary p-4 rounded-lg">
            {/* Simple QR code SVG pattern */}
            <rect width="200" height="200" fill="white" />
            <rect x="20" y="20" width="160" height="160" fill="white" stroke="black" strokeWidth="2" />
            <rect x="40" y="40" width="40" height="40" fill="black" />
            <rect x="120" y="40" width="40" height="40" fill="black" />
            <rect x="40" y="120" width="40" height="40" fill="black" />
            <rect x="100" y="100" width="60" height="60" fill="black" />
            <rect x="60" y="60" width="80" height="20" fill="black" />
        </div>

        {/* Status Message */}
        <div className="flex flex-col items-center gap-4">
          {status === 'scanning' && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg font-medium">Scanning QR code...</p>
            </>
          )}

          {status === 'success' && (
            <p className="text-lg font-medium text-green-600">QR code scanned successfully ✅</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}