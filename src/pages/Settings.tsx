import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, LogOut, Shield, Heart, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface SettingsProps {
  onBack: () => void;
  onLeaveRoom: () => void;
}

export function Settings({ onBack, onLeaveRoom }: SettingsProps) {
  const { settings, updateSettings } = useAppStore();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
  };

  const showPrivacyInfo = () => {
    alert(`Privacy Policy:

• We do not collect personal information
• Your nickname and avatar are anonymous
• Location is only used to verify clinic proximity
• Messages are moderated for safety
• No chat history is permanently stored
• You can leave at any time

This service is designed to protect your privacy while providing support.`);
  };

  const showTermsInfo = () => {
    alert(`Terms of Service:

• This chat is for sharing experiences only
• Not for medical advice or emergencies
• Be respectful to other users
• No personal information sharing
• Follow community guidelines
• Report inappropriate behavior

For medical emergencies, contact hospital staff immediately.`);
  };

  const showAboutInfo = () => {
    alert(`About Companions Anonymous:

A safe, moderated chat space for companions waiting at medical facilities.

• Anonymous and private
• AI-moderated for safety
• Calming resources included
• Mobile-first design
• No accounts required

Built with compassion for those who wait.`);
  };

  const handleLeaveRoom = () => {
    if (confirm('Are you sure you want to leave the chat room? You will need to go through verification again to rejoin.')) {
      onLeaveRoom();
    }
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
              onClick={showPrivacyInfo}
            >
              <Shield size={16} className="mr-3" />
              Privacy Policy
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={showTermsInfo}
            >
              <HelpCircle size={16} className="mr-3" />
              Terms of Service
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={showAboutInfo}
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
    </PageContainer>
  );
}