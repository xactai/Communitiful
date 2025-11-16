import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, LogOut, Shield, Heart, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';

interface SettingsProps {
  onBack: () => void;
  onLeaveRoom: () => void;
}

export function Settings({ onBack, onLeaveRoom }: SettingsProps) {
  const { settings, updateSettings, setCurrentStep, clearMessages } = useAppStore();
  const [showExitFeedback, setShowExitFeedback] = useState(false);
  const [feedbackStage, setFeedbackStage] = useState<'form' | 'thanks'>('form');
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const ratingEmojis = ['😞','😕','😐','🙂','😊'];

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
  };

  const handleLeaveRoom = () => {
    setFeedbackStage('form');
    setShowExitFeedback(true);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Accessibility Settings */}
        <div className="space-y-4">
          <h2 className="font-medium">Accessibility</h2>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">Larger Text</p>
                <p className="text-sm text-muted-foreground">
                  Increase text size for better readability
                </p>
              </div>
              <Switch
                checked={settings.largerText}
                onCheckedChange={(checked) => handleSettingChange('largerText', checked)}
              />
            </div>
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">Reduce Motion</p>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
              />
            </div>
          </div>
        </div>

        {/* Language (placeholder) */}
        <div className="space-y-3">
          <h2 className="font-medium">Language</h2>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              English (US) - More languages coming soon
            </p>
          </div>
        </div>

        {/* Information */}
        <div className="space-y-3">
          <h2 className="font-medium">Information</h2>
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setCurrentStep('privacy')}
            >
              <Shield size={16} className="mr-3" />
              Privacy Policy
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setCurrentStep('privacy')}
            >
              <HelpCircle size={16} className="mr-3" />
              Terms of Service
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setCurrentStep('about-details')}
            >
              <Heart size={16} className="mr-3" />
              About Companions Anonymous
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3">
          <h2 className="font-medium text-destructive">Leave Room</h2>
          
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Leaving will end your current session. You'll need to verify your 
              location and go through setup again to rejoin.
            </p>
            
            <Button 
              variant="destructive" 
              size="touch" 
              onClick={handleLeaveRoom}
              className="w-full"
            >
              <LogOut size={16} />
              Leave Chat Room
            </Button>
          </div>
        </div>

        {/* Version info */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          Companions Anonymous v1.0.0
        </div>
      </div>
      
      {/* Exit Feedback Modal */}
      <Dialog open={showExitFeedback} onOpenChange={(open) => { if (!open) setShowExitFeedback(false); }}>
        <DialogContent className="sm:max-w-md">
          {feedbackStage === 'form' ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">How was your chat experience?</DialogTitle>
                <DialogDescription className="text-center">
                  Your feedback helps us make this space calmer and kinder.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-2">
                  {ratingEmojis.map((emo, idx) => (
                    <button
                      key={idx}
                      className={`text-2xl p-2 rounded-md border transition ${
                        rating === idx + 1 ? 'bg-primary/10 border-primary/30' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setRating(idx + 1)}
                      aria-label={`Rate ${idx + 1}`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
                <div className="w-full">
                  <textarea
                    className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Anything we could improve? (optional)"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowExitFeedback(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={rating === null}
                    onClick={() => {
                      setFeedbackStage('thanks');
                      setTimeout(() => {
                        setShowExitFeedback(false);
                        clearMessages();
                        onLeaveRoom?.();
                        setCurrentStep('landing');
                      }, 1200);
                    }}
                  >
                    Submit & Exit
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle2 className="text-success" size={28} />
              </div>
              <div className="text-base font-medium mb-1">Thank you for your feedback!</div>
              <div className="text-xs text-muted-foreground">Taking you back to the landing page…</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}