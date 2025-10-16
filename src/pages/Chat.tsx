import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { sharedChat } from '@/lib/sharedChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { Settings, Send, AlertTriangle, MessageCircle } from 'lucide-react';
import { Message, AVATARS, TEST_CLINIC } from '@/lib/types';
import { 
  preFilterMessage, 
  RateLimiter, 
  formatTimeAgo, 
  generateNickname 
} from '@/lib/utils';
import { 
  detectEmergencyKeywords
} from '@/lib/deepseek';
import { moderateMessage, ModerationOptions } from '@/lib/moderation';
import { ModerationBanner } from '@/components/ModerationBanner';

interface ChatProps {
  onOpenSettings: () => void;
  onOpenRelaxation: () => void;
}

export function Chat({ onOpenSettings, onOpenRelaxation }: ChatProps) {
  const { session, messages, addMessage, updateMessage, userMessageCount, incrementUserMessageCount } = useAppStore();
  const [sharedMessages, setSharedMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [rateLimiter] = useState(() => new RateLimiter(5, 60000)); // 5 messages per minute
  const [showModerationBanner, setShowModerationBanner] = useState(false);
  const [moderationMessage, setModerationMessage] = useState("Moderation Failed");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [defaultMessagesLoaded, setDefaultMessagesLoaded] = useState(false);
  const lastUserMessageTimeRef = useRef<number>(Date.now());
  
  // Predefined messages to simulate an active chat environment
  const defaultMessages = [
    { sender: "🧑‍⚕️ Dr. Mira", message: "Good morning everyone 🌞 Hope you're all feeling stronger today!" },
    { sender: "🤖 CompanionBot", message: "Hey there! Remember — a deep breath can reset your mind 🌿" },
    { sender: "👩‍🦰 Ava", message: "Just had my breakfast, feeling a bit sleepy but calm 😴" },
    { sender: "🧔 Leo", message: "Haha same Ava 😅 these hospital mornings are too quiet sometimes!" },
    { sender: "👩‍⚕️ Nurse Joy", message: "Morning rounds starting soon, stay positive folks 💚" },
    { sender: "🧘‍♀️ ZenBot", message: "Tip of the day: Try 4-7-8 breathing — inhale 4s, hold 7s, exhale 8s 💨" },
    { sender: "👨‍🦱 Max", message: "Thanks ZenBot, that actually helped me calm down last night 🙌" },
    { sender: "🤖 CompanionBot", message: "If you're new here, say hi 👋 and let's chat about your day!" },
  ];
  
  // Subscribe to shared chat
  useEffect(() => {
    const unsubscribe = sharedChat.subscribe((messages) => {
      setSharedMessages(messages);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sharedMessages]);

  // Load default messages when component mounts
  useEffect(() => {
    if (!defaultMessagesLoaded && session) {
      // Add default messages with staggered timing
      const loadMessages = async () => {
        for (let i = 0; i < defaultMessages.length; i++) {
          const msg = defaultMessages[i];
          const messageId = crypto.randomUUID();
          
          // Create a message object for each predefined message
          const predefMessage: Message = {
            id: messageId,
            clinicId: session.clinicId,
            sessionId: `predefined-${i}`, // Use a special session ID for predefined messages
            authorType: "companion",
            text: msg.message,
            createdAt: new Date(Date.now() - (defaultMessages.length - i) * 60000), // Stagger timestamps
            moderation: { status: 'allowed' },
            companionIdentity: {
              name: msg.sender.split(' ')[1] || msg.sender, // Extract name part
              emoji: msg.sender.split(' ')[0] // Extract emoji part
            }
          };
          
          sharedChat.addMessage(predefMessage);
          
          // Add a small delay between messages for realistic loading
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        setDefaultMessagesLoaded(true);
      };
      
      loadMessages();
    }
  }, [session, defaultMessagesLoaded]); // Run when session is available and messages not yet loaded

  // Get avatar emoji for session
  const getAvatarEmoji = (avatarId: string) => {
    return AVATARS.find(a => a.id === avatarId)?.emoji || '👤';
  };

  // Get consistent avatar for other users based on session ID
  const getAvatarForSession = (sessionId: string) => {
    const hash = sessionId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % AVATARS.length;
    return AVATARS[index].emoji;
  };

  // Get consistent nickname for other users based on session ID
  const getNicknameForSession = (sessionId: string) => {
    const hash = sessionId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    // Use the hash to generate a consistent nickname
    const adjectives = ['Kind', 'Calm', 'Gentle', 'Caring', 'Quiet', 'Patient', 'Warm', 'Peaceful'];
    const nouns = ['Friend', 'Companion', 'Helper', 'Listener', 'Supporter', 'Buddy', 'Ally', 'Guest'];
    const adjIndex = Math.abs(hash) % adjectives.length;
    const nounIndex = Math.abs(hash >> 4) % nouns.length;
    return `${adjectives[adjIndex]} ${nouns[nounIndex]}`;
  };

  // Auto-response functionality has been removed

  // Handle message send
  const handleSend = async () => {
    if (!inputText.trim() || !session || sending) return;

    // Rate limiting
    if (!rateLimiter.canProceed()) {
      const timeLeft = Math.ceil(rateLimiter.getTimeUntilReset() / 1000);
      alert(`You're sending messages too quickly. Please wait ${timeLeft} seconds.`);
      return;
    }
    
    // Run moderation checks
    const messageHistory = sharedMessages.map(m => m.text);
    const moderationOptions: ModerationOptions = {
      sessionId: session.id,
      clinicId: session.clinicId,
      messageHistory: messageHistory,
      lastMessageTimestamp: lastUserMessageTimeRef.current
    };
    
    try {
      // Use async moderation with Grok
      const moderationResult = await moderateMessage(inputText, moderationOptions);
      
      if (!moderationResult.passed) {
        // Show moderation banner
        setModerationMessage(moderationResult.reason || "Moderation Failed");
        setShowModerationBanner(true);
        
        // Clear the input
        setInputText('');
        return;
      }
    } catch (error) {
      console.error("Error in message handling:", error);
      // Continue with message sending if moderation fails
    }

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    // Pre-filter
    const preFilter = preFilterMessage(messageText);
    if (!preFilter.allowed) {
      alert(preFilter.reason);
      setSending(false);
      setInputText(messageText); // Restore text for editing
      return;
    }

    // Create pending message
    const messageId = crypto.randomUUID();
    const pendingMessage: Message = {
      id: messageId,
      clinicId: session.clinicId,
      sessionId: session.id,
      authorType: 'user',
      text: messageText,
      createdAt: new Date(),
      moderation: { status: 'pending' }
    };

    // Update last user message time
    lastUserMessageTimeRef.current = Date.now();
    
    // Add message to both local and shared state
    addMessage(pendingMessage);
    sharedChat.addMessage(pendingMessage);

    try {
      // Check for emergency keywords first
      if (detectEmergencyKeywords(messageText)) {
        // Immediately show safety message
        setTimeout(() => {
          const agentMessage: Message = {
            id: crypto.randomUUID(),
            clinicId: session.clinicId,
            sessionId: 'agent',
            authorType: 'agent',
            text: 'If this is urgent, please inform the hospital staff right away.',
            createdAt: new Date(),
            moderation: { status: 'allowed' }
          };
              sharedChat.addMessage(agentMessage);
        }, 500);
      }

      // No need to moderate again, already done before sending
      // Just update the message status
      const updatedMessage = { ...pendingMessage, moderation: { status: 'allowed' } };
      updateMessage(messageId, {
        moderation: { status: 'allowed' }
      });
        
      // Update the message via SharedChatManager
      sharedChat.updateMessage(messageId, {
        moderation: { status: 'allowed' }
      });

      // Increment user message count
      incrementUserMessageCount();
    } catch (error) {
      console.error('Moderation error:', error);
      // Fallback: allow message on error
      updateMessage(messageId, {
        moderation: { status: 'allowed' }
      });
      // Update the message via SharedChatManager on error
      sharedChat.updateMessage(messageId, {
        moderation: { status: 'allowed' }
      });
    } finally {
      setSending(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render message
  const renderMessage = (message: Message) => {
    const isOwn = message.sessionId === session?.id;
    const isAgent = message.authorType === 'agent';
    const isSystem = message.authorType === 'system';
    const isCompanion = message.authorType === 'companion';
    const isTyping = message.sessionId === 'typing';
    const isBlocked = message.moderation.status === 'blocked';
    const isPending = message.moderation.status === 'pending';

    if (isBlocked) {
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className="max-w-xs bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle size={16} />
              Message blocked
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {message.moderation.reason}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] sm:max-w-xs ${
          isOwn 
            ? 'bg-primary text-primary-foreground' 
            : isAgent
            ? 'bg-accent border border-accent-foreground/10'
            : isSystem || isCompanion
            ? 'bg-info/10 border border-info/20'
            : 'bg-surface border'
        } rounded-lg p-3 ${isPending ? 'opacity-50' : ''} ${isTyping ? 'animate-pulse' : ''}`}>
          {/* Avatar and name for all messages */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 text-sm flex-shrink-0">
              {isAgent 
                ? '🤝' 
                : isSystem 
                ? 'ℹ️'
                : isCompanion && message.companionIdentity
                ? message.companionIdentity.emoji
                : isTyping
                ? '💭'
                : isOwn 
                ? getAvatarEmoji(session?.avatarId || '1')
                : getAvatarForSession(message.sessionId)
              }
            </div>
            <span className="text-xs font-medium truncate">
              {isAgent 
                ? 'Facilitator' 
                : isSystem 
                ? 'System'
                : isCompanion && message.companionIdentity
                ? message.companionIdentity.name
                : isTyping
                ? 'Someone'
                : isOwn 
                ? session?.nick || 'You'
                : getNicknameForSession(message.sessionId)
              }
            </span>
          </div>
          
          <p className="text-sm sm:text-sm leading-relaxed break-words">{message.text}</p>
          
          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
            <span>{formatTimeAgo(message.createdAt)}</span>
            {isPending && <span>Checking...</span>}
          </div>
        </div>
      </div>
    );
  };

  if (!session) {
    return <div>No session found</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
      {/* Moderation Banner */}
      <ModerationBanner 
        visible={showModerationBanner} 
        message={moderationMessage}
        onClose={() => setShowModerationBanner(false)}
      />
      
      {/* Header */}
      <div className="bg-surface border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 bg-primary-soft rounded-full flex items-center justify-center flex-shrink-0">
            {getAvatarEmoji(session.avatarId)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-medium text-sm sm:text-base truncate">{session.nick}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              {TEST_CLINIC.name}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={onOpenRelaxation}>
            🧘
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={onOpenSettings}>
            <Settings size={16} />
          </Button>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-warning/10 border-b border-warning/20 px-4 py-2">
        <p className="text-xs text-center">
          <AlertTriangle size={12} className="inline mr-1" />
          This chat is for sharing experiences only — not medical advice. 
          In emergencies, contact hospital staff.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {sharedMessages.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            <p className="mb-2 text-sm sm:text-base">Welcome to the waiting room chat!</p>
            <p className="text-xs sm:text-sm">Share your thoughts and connect with others.</p>
          </div>
        )}
        
        {sharedMessages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-surface border-t px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 min-w-0">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share with fellow companions..."
              disabled={sending}
              maxLength={500}
              className="text-sm sm:text-base"
            />
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {getAvatarEmoji(session.avatarId)} {session.nick} • Anon • Moderated • On-site
            </p>
          </div>
          
          <Button
            variant="default"
            size="icon"
            className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
            onClick={handleSend}
            disabled={!inputText.trim() || sending}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}