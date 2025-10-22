import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/AppLayout';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-primary mb-2">Registration Complete!</h1>
          <p className="text-lg text-muted-foreground">Scan the QR code below to join the chat room</p>
        </motion.div>

        {/* QR Code */}
        <motion.div 
          className="mb-8 border-4 border-primary p-4 rounded-lg bg-white shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg width="200" height="200" viewBox="0 0 200 200" className="block">
            {/* QR code pattern */}
            <rect width="200" height="200" fill="white" />
            <rect x="20" y="20" width="160" height="160" fill="white" stroke="black" strokeWidth="2" />
            <rect x="40" y="40" width="40" height="40" fill="black" />
            <rect x="120" y="40" width="40" height="40" fill="black" />
            <rect x="40" y="120" width="40" height="40" fill="black" />
            <rect x="100" y="100" width="60" height="60" fill="black" />
            <rect x="60" y="60" width="80" height="20" fill="black" />
            {/* Additional QR code pattern elements */}
            <rect x="20" y="20" width="20" height="20" fill="black" />
            <rect x="160" y="20" width="20" height="20" fill="black" />
            <rect x="20" y="160" width="20" height="20" fill="black" />
            <rect x="80" y="80" width="20" height="20" fill="black" />
            <rect x="100" y="80" width="20" height="20" fill="black" />
            <rect x="80" y="100" width="20" height="20" fill="black" />
            <rect x="120" y="80" width="20" height="20" fill="black" />
            <rect x="80" y="120" width="20" height="20" fill="black" />
            <rect x="140" y="140" width="20" height="20" fill="black" />
            <rect x="160" y="140" width="20" height="20" fill="black" />
            <rect x="140" y="160" width="20" height="20" fill="black" />
          </svg>
        </motion.div>

        {/* Status Message */}
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {status === 'scanning' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg font-medium">Scanning QR code...</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg font-medium text-green-600">QR code scanned successfully ✅</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageContainer>
  );
}