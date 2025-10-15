import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/AppLayout';
import { AVATARS } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface AvatarDisplayProps {
  avatarId: string;
  nickname: string;
  onContinue: () => void;
}

export function AvatarDisplay({ avatarId, nickname, onContinue }: AvatarDisplayProps) {
  const avatar = AVATARS.find(a => a.id === avatarId);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center space-y-8 text-center py-8">
        {/* Header */}
        <div className="space-y-2">
          <Sparkles size={24} className="text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-semibold">Your Anonymous Identity</h1>
          <p className="text-muted-foreground text-sm">
            This is how you'll appear to others in the chat
          </p>
        </div>

        {/* Avatar_Display */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 space-y-4">
          <div className="w-20 h-20 mx-auto bg-background rounded-full border-4 border-primary/20 flex items-center justify-center text-4xl shadow-lg">
            {avatar?.emoji || '🔵'}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{nickname}</h2>
            <p className="text-sm text-muted-foreground">{avatar?.name || 'Anonymous User'}</p>
          </div>
        </div>

        {/* Information */}
        <div className="bg-muted/30 rounded-lg p-4 max-w-sm">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your avatar and nickname have been randomly assigned to protect your privacy. 
            These cannot be changed once you enter the chat.
          </p>
        </div>

        {/* Continue Button */}
        <Button
          variant="default"
          size="touch"
          onClick={onContinue}
          className="w-full max-w-sm"
        >
          Enter Chat Room
        </Button>
      </div>
    </PageContainer>
  );
}