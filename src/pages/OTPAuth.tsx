import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { OTP_TEST_CODE } from '@/lib/types';
import { useAppStore } from '@/stores/useAppStore';

interface OTPAuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function OTPAuth({ onBack, onSuccess }: OTPAuthProps) {
  const { otpPhone, setOtpPhone } = useAppStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone number display
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    return phone;
  };

  // Handle phone submission
  const handlePhoneSubmit = () => {
    setError('');
    const cleaned = otpPhone.replace(/\D/g, '');
    
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      startResendTimer();
    }, 1000);
  };

  // Handle OTP input
  const handleOtpInput = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    
    const newCode = otpCode.split('');
    newCode[index] = value;
    const updatedCode = newCode.join('');
    
    setOtpCode(updatedCode);
    setError('');
    
    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when complete
    if (updatedCode.length === 6) {
      verifyOTP(updatedCode);
    }
  };

  // Handle backspace in OTP
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOTP = (code: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      if (code === OTP_TEST_CODE) {
        onSuccess();
      } else {
        setError('Invalid code. Please try again.');
        setOtpCode('');
        otpInputRefs.current[0]?.focus();
      }
    }, 800);
  };

  // Resend timer
  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(30);
    
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Resend OTP
  const handleResend = () => {
    setError('');
    setOtpCode('');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      startResendTimer();
      otpInputRefs.current[0]?.focus();
    }, 1000);
  };

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Verification</h1>
      </div>

      <div className="space-y-6">
        {/* Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-soft rounded-full">
            <Smartphone size={24} className="text-primary" />
          </div>
        </div>

        {step === 'phone' ? (
          /* Phone input step */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-medium">Enter Your Phone Number</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                We verify to prevent outsiders. No account is created.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={otpPhone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    if (cleaned.length <= 10) {
                      setOtpPhone(cleaned);
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
                onClick={handlePhoneSubmit}
                disabled={loading || otpPhone.replace(/\D/g, '').length !== 10}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
            </div>
          </div>
        ) : (
          /* OTP input step */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-medium">Enter Verification Code</h2>
              <p className="text-sm text-muted-foreground">
                Code sent to {otpPhone}
              </p>
              <p className="text-xs text-muted-foreground">
                For testing, use: {OTP_TEST_CODE}
              </p>
            </div>

            <div className="space-y-4">
              {/* OTP Input Grid */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Input
                    key={index}
                    ref={(el) => otpInputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpCode[index] || ''}
                    onChange={(e) => handleOtpInput(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-mono ${
                      error ? 'border-destructive' : ''
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              {/* Resend */}
              <div className="text-center">
                {canResend ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResend}
                    disabled={loading}
                  >
                    Resend Code
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resend in {resendTimer}s
                  </p>
                )}
              </div>

              {/* Back to phone */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('phone')}
                className="w-full"
              >
                Change Phone Number
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}