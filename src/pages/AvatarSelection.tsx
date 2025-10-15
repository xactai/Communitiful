import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, Shuffle } from 'lucide-react';
import { AVATARS } from '@/lib/types';
import { generateNickname, cn } from '@/lib/utils';

interface AvatarSelectionProps {
  onBack: () => void;
  onComplete: (avatarId: string, nickname: string) => void;
}

export function AvatarSelection({ onBack, onComplete }: AvatarSelectionProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [nickname, setNickname] = useState(generateNickname());

  const handleRandomize = () => {
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    setSelectedAvatar(randomAvatar.id);
    setNickname(generateNickname());
  };

  const handleComplete = () => {
    if (selectedAvatar && nickname.trim()) {
      onComplete(selectedAvatar, nickname.trim());
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Choose Your Identity</h1>
      </div>

      <div className="space-y-6">
        {/* Instructions */}
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Pick an avatar and nickname to represent you anonymously in the chat.
          </p>
        </div>

        {/* Avatar Grid */}
        <div>
          <h3 className="font-medium mb-3">Choose Avatar</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all",
                  "flex items-center justify-center text-xl sm:text-2xl",
                  "hover:border-primary/50 hover:bg-primary-soft/50",
                  "min-h-[60px] sm:min-h-[80px]",
                  selectedAvatar === avatar.id
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-surface"
                )}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
          
          <div className="text-center mt-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {AVATARS.find(a => a.id === selectedAvatar)?.name}
            </p>
          </div>
        </div>

        {/* Nickname */}
        <div>
          <h3 className="font-medium mb-3">Your Nickname</h3>
          <div className="space-y-3">
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter nickname"
              maxLength={20}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomize}
              className="w-full"
            >
              <Shuffle size={16} />
              Randomize Both
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface border flex items-center justify-center">
              {AVATARS.find(a => a.id === selectedAvatar)?.emoji}
            </div>
            <span className="font-medium">{nickname || 'Your Nickname'}</span>
          </div>
        </div>

        {/* Continue */}
        <Button
          variant="default"
          size="touch"
          onClick={handleComplete}
          disabled={!selectedAvatar || !nickname.trim()}
          className="w-full"
        >
          Join Chat
        </Button>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground text-center">
          Your identity is completely anonymous. No personal information is stored.
        </p>
      </div>
    </PageContainer>
  );
}