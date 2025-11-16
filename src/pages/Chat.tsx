import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { sharedChat } from '@/lib/sharedChat';
import { realtimeChat } from '@/lib/realtimeChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { Settings, Send, AlertTriangle, MessageCircle, Users, LogOut, CheckCircle2 } from 'lucide-react';
import { Message, AVATARS, TEST_CLINIC } from '@/lib/types';
import { UserPresence } from '@/lib/userPresence';
import { 
  preFilterMessage, 
  RateLimiter, 
  formatTimeAgo, 
  generateNickname 
} from '@/lib/utils';
import { 
  detectEmergencyKeywords
} from '@/lib/deepseek';
import { ModerationBanner } from '@/components/ModerationBanner';
import { moderateWithGemini } from '@/lib/geminiModeration';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useTranslation';

interface ChatProps {
  onOpenSettings: () => void;
  onOpenRelaxation: () => void;
}

export function Chat({ onOpenSettings, onOpenRelaxation }: ChatProps) {
  const { t } = useTranslation();
  const { session, addMessage, updateMessage, incrementUserMessageCount, setCurrentStep, clearMessages } = useAppStore();
  const [sharedMessages, setSharedMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [rateLimiter] = useState(() => new RateLimiter(5, 60000)); // 5 messages per minute
  const [showModerationBanner, setShowModerationBanner] = useState(false);
  const [moderationMessage, setModerationMessage] = useState("Moderation Notice");
  const [moderationType, setModerationType] = useState<'block' | 'warn' | 'safety'>('warn');
  const [moderationSuggestions, setModerationSuggestions] = useState<string[]>([]);
  const [showStickers, setShowStickers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [defaultMessagesLoaded, setDefaultMessagesLoaded] = useState(false);
  const lastUserMessageTimeRef = useRef<number>(Date.now());
  const [showUserJoinNotification, setShowUserJoinNotification] = useState(false);
  const [userJoinMessage, setUserJoinMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<UserPresence[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showExitFeedback, setShowExitFeedback] = useState(false);
  const [feedbackStage, setFeedbackStage] = useState<'form' | 'thanks'>('form');
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const ratingEmojis = ['😞','😕','😐','🙂','😊'];
  
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
  
  // Initialize real-time chat and subscribe to messages
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const initializeChat = async () => {
      try {
        // First check database health
        const healthCheck = await realtimeChat.checkDatabaseHealth();
        console.log('🔍 Database health check:', healthCheck);
        
        if (healthCheck.status === 'error') {
          console.error('❌ Database issue:', healthCheck.message);
          console.log('💡 Solution:', healthCheck.solution);
          throw new Error(healthCheck.message);
        }
        
        await realtimeChat.initialize();
        unsubscribe = realtimeChat.subscribe((messages) => {
          setSharedMessages(messages);
        });
        console.log('✅ Real-time chat initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize real-time chat:', error);
        console.log('🔄 Falling back to local chat');
        // Fallback to local chat
        unsubscribe = sharedChat.subscribe((messages) => {
          setSharedMessages(messages);
        });
      }
    };
    
    initializeChat();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Subscribe to user presence updates
  useEffect(() => {
    const unsubscribe = sharedChat.subscribeToPresence((users) => {
      const previousCount = onlineUsers.length;
      const newCount = users.length;
      
      // Show notification when user count changes
      if (previousCount > 0 && newCount > previousCount) {
        const count = newCount - previousCount;
        setUserJoinMessage(`${count} ${count > 1 ? t('chat.companions') : t('chat.companion')} ${t('chat.userJoined')}`);
        setShowUserJoinNotification(true);
        setTimeout(() => setShowUserJoinNotification(false), 3000);
      } else if (previousCount > 0 && newCount < previousCount) {
        const count = previousCount - newCount;
        setUserJoinMessage(`${count} ${count > 1 ? t('chat.companions') : t('chat.companion')} ${t('chat.userLeft')}`);
        setShowUserJoinNotification(true);
        setTimeout(() => setShowUserJoinNotification(false), 3000);
      }
      
      setOnlineUsers(users);
      setTypingUsers(sharedChat.getTypingUsers());
    });
    
    return () => {
      unsubscribe();
    };
  }, [onlineUsers.length]);

  // Set current user in presence system when session is available
  useEffect(() => {
    if (session) {
      sharedChat.setCurrentUser(session);
    }
    
    // Cleanup on unmount
    return () => {
      sharedChat.removeCurrentUser();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [session]);

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
          
          try {
            await realtimeChat.addMessage(predefMessage);
          } catch (error) {
            console.error('Failed to add predefined message to real-time chat:', error);
            // Fallback to local chat
            sharedChat.addMessage(predefMessage);
          }
          
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
  // Sticker set (predefined, vision-aligned)
  const stickers: { id: string; label: string; glyph: string }[] = [
    { id: 'heart-support', label: 'Heart Support', glyph: '💙' },
    { id: 'calm-breath', label: 'Calm Breath', glyph: '🌿' },
    { id: 'hope-star', label: 'Hope Star', glyph: '⭐' },
    { id: 'gentle-hug', label: 'Gentle Hug', glyph: '🤗' },
    { id: 'peace-dove', label: 'Peace', glyph: '🕊️' },
    { id: 'kind-hands', label: 'Kind Hands', glyph: '🫶' },
    { id: 'soft-cloud', label: 'Soft Cloud', glyph: '☁️' },
    { id: 'light-moon', label: 'Light Moon', glyph: '🌙' },
    // Additional calming/supportive stickers
    { id: 'warm-sunrise', label: 'Warm Sunrise', glyph: '🌅' },
    { id: 'soothing-rainbow', label: 'Soothing Rainbow', glyph: '🌈' },
    { id: 'comfort-tea', label: 'Comfort Tea', glyph: '🍵' },
    { id: 'hydrate', label: 'Hydrate', glyph: '💧' },
    { id: 'calm-candle', label: 'Calm Candle', glyph: '🕯️' },
    { id: 'lotus', label: 'Lotus', glyph: '🪷' },
    { id: 'sparkles', label: 'Little Wins', glyph: '✨' },
    { id: 'blossom', label: 'Gentle Blossom', glyph: '🌸' },
    { id: 'earbuds', label: 'Soft Music', glyph: '🎧' },
    { id: 'book', label: 'Quiet Read', glyph: '📖' },
    { id: 'folded-hands', label: 'Gratitude', glyph: '🙏' },
    { id: 'smile', label: 'Soft Smile', glyph: '😊' },
    { id: 'white-heart', label: 'Care', glyph: '🤍' },
    { id: 'orange-heart', label: 'Warmth', glyph: '🧡' },
    { id: 'sparkles-orbit', label: 'Hopeful Light', glyph: '💫' },
    { id: 'hugging-hands', label: 'Support', glyph: '🫂' },
    { id: 'meditation-man', label: 'Breathe (He)', glyph: '🧘‍♂️' },
    { id: 'meditation-woman', label: 'Breathe (She)', glyph: '🧘‍♀️' },
    { id: 'green-leaf', label: 'Fresh Air', glyph: '🍃' },
    { id: 'thought', label: 'Thinking of You', glyph: '💭' },
  ];

  const STICKER_PREFIX = ':sticker:';
  const buildStickerToken = (id: string) => `${STICKER_PREFIX}${id}:`;
  const parseSticker = (text: string | undefined) => {
    if (!text) return null;
    if (!text.startsWith(STICKER_PREFIX)) return null;
    const id = text.slice(STICKER_PREFIX.length, -1);
    return stickers.find(s => s.id === id) || null;
  };

  const handleSendSticker = async (stickerId: string) => {
    if (!session || sending) return;
    setShowStickers(false);
    const token = buildStickerToken(stickerId);
    const messageId = crypto.randomUUID();
    const pendingMessage: Message = {
      id: messageId,
      clinicId: session.clinicId,
      sessionId: session.id,
      authorType: 'user',
      text: token,
      createdAt: new Date(),
      moderation: { status: 'allowed' }
    };
    try {
      addMessage(pendingMessage);
      try {
        await realtimeChat.addMessage(pendingMessage);
      } catch (e) {
        sharedChat.addMessage(pendingMessage);
      }
      incrementUserMessageCount();
    } catch (e) {
      console.error('Sticker send error:', e);
    }
  };

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
    const messageText = inputText.trim();
    
    // Pre-filter before network calls
    const preFilter = preFilterMessage(messageText);
    if (!preFilter.allowed) {
      alert(preFilter.reason);
      return;
    }

    setSending(true);
    
    // Run Gemini moderation before posting
    try {
      const geminiResult = await moderateWithGemini(messageText, {
        sessionId: session.id,
        clinicId: session.clinicId,
        messageHistory: sharedMessages.map(m => m.text)
      });

      if (!geminiResult.allowed) {
        setModerationMessage(geminiResult.reason || "Message blocked for safety");
        setModerationType('block');
        setModerationSuggestions([]);
        setShowModerationBanner(true);
        setSending(false);
        return;
      }
    } catch (error) {
      console.error("Gemini moderation error:", error);
      // Allow message if moderation service fails
    }

    setInputText('');

    // Create pending message
    const messageId = crypto.randomUUID();
    const pendingMessage: Message = {
      id: messageId,
      clinicId: session.clinicId,
      sessionId: session.id,
      authorType: 'user',
      text: messageText,
      createdAt: new Date(),
      moderation: { status: 'allowed' }
    };

    // Update last user message time
    lastUserMessageTimeRef.current = Date.now();
    
    // Add message to both local and real-time state
    addMessage(pendingMessage);
    
    try {
      await realtimeChat.addMessage(pendingMessage);
    } catch (error) {
      console.error('Failed to send message to real-time chat:', error);
      // Fallback to local chat
      sharedChat.addMessage(pendingMessage);
    }

    try {
      // Check for emergency keywords first
      if (detectEmergencyKeywords(messageText)) {
        // Immediately show safety message
        setTimeout(async () => {
          const agentMessage: Message = {
            id: crypto.randomUUID(),
            clinicId: session.clinicId,
            sessionId: 'agent',
            authorType: 'agent',
            text: 'If this is urgent, please inform the hospital staff right away.',
            createdAt: new Date(),
            moderation: { status: 'allowed' }
          };
          
          try {
            await realtimeChat.addMessage(agentMessage);
          } catch (error) {
            console.error('Failed to send agent message to real-time chat:', error);
            // Fallback to local chat
            sharedChat.addMessage(agentMessage);
          }
        }, 500);
      }

      // Increment user message count
      incrementUserMessageCount();
    } catch (error) {
      console.error('Message send error:', error);
      // Attempt to roll back local state on failure
      updateMessage(messageId, {
        moderation: { status: 'blocked', reason: 'Failed to send message. Please try again.' }
      });
      try {
        await realtimeChat.updateMessage(messageId, {
          moderation: { status: 'blocked', reason: 'Delivery failed' }
        });
      } catch (error) {
        console.error('Failed to update message in real-time chat:', error);
        sharedChat.updateMessage(messageId, {
          moderation: { status: 'blocked', reason: 'Delivery failed' }
        });
      }
    } finally {
      setSending(false);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    
    // Set typing status
    if (value.trim()) {
      sharedChat.setTypingStatus(true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sharedChat.setTypingStatus(false);
      }, 3000);
    } else {
      sharedChat.setTypingStatus(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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

    // Sticker rendering
    const sticker = parseSticker(message.text);
    return (
      <div key={message.id} className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[85%] sm:max-w-xs transition-transform ${
            isOwn
              ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg rounded-2xl'
              : isAgent
              ? 'bg-accent/80 border border-accent-foreground/10 rounded-2xl shadow'
              : isSystem || isCompanion
              ? 'bg-info/10 border border-info/20 rounded-2xl shadow'
              : 'bg-white/90 border border-slate-200 rounded-2xl shadow-sm'
          } p-3 ${isPending ? 'opacity-50' : ''} ${isTyping ? 'animate-pulse' : ''} hover:-translate-y-[1px]`}
        >
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
          {sticker ? (
            <div className="flex items-center justify-center py-2">
              <div className="text-3xl sm:text-4xl" title={sticker.label} aria-label={sticker.label}>
                {sticker.glyph}
              </div>
            </div>
          ) : (
            <p className="text-sm sm:text-sm leading-relaxed break-words">
              {message.text}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2 text-[11px] opacity-80">
            <span
              className={`px-2 py-0.5 rounded-full ${
                isOwn ? 'bg-white/20 text-primary-foreground' : 'bg-muted/60 text-muted-foreground'
              }`}
            >
              {formatTimeAgo(message.createdAt)}
            </span>
            {isPending && <span className="italic">{t('chat.checking')}</span>}
          </div>
        </div>
      </div>
    );
  };

  if (!session) {
    return <div>No session found</div>;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto sm:max-w-lg md:max-w-2xl lg:max-w-4xl bg-gradient-to-b from-[#eef2ff] via-white to-white">
      {/* Moderation Banner */}
      <ModerationBanner 
        visible={showModerationBanner} 
        message={moderationMessage}
        type={moderationType}
        suggestions={moderationSuggestions}
        onClose={() => setShowModerationBanner(false)}
      />

      {/* User Join/Leave Notification */}
      {showUserJoinNotification && (
        <div className="bg-info/10 border-b border-info/20 px-4 py-2 animate-in slide-in-from-top duration-300">
          <p className="text-xs text-center text-info">
            <Users size={12} className="inline mr-1" />
            {userJoinMessage}
          </p>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-primary-soft/60 border-b px-4 py-3 flex items-center justify-between backdrop-blur-sm">
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
        
        {/* Online Users Count */}
        <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full shadow-sm">
          <Users size={12} className="text-primary" />
          <span>{onlineUsers.length} {t('chat.online')}</span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-4 sm:ml-6">
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5" onClick={onOpenRelaxation}>
            🧘
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5" onClick={onOpenSettings}>
            <Settings size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5" 
            onClick={() => { setFeedbackStage('form'); setShowExitFeedback(true); }}
            aria-label="Leave chat"
            title="Leave chat"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>

      {/* Apollo branding */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sm:gap-4 shadow-[inset_0_-1px_0_rgba(15,23,42,0.05)]">
        <div className="flex-shrink-0 w-16 h-16 rounded-full border border-primary/20 bg-white flex items-center justify-center p-2">
          <img 
            src="/images/Apollo Logo.png" 
            alt="Apollo Hospital logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Partner Hospital</p>
          <p className="text-base font-semibold text-primary leading-tight">Apollo Hospital</p>
          <p className="text-xs text-muted-foreground">Companion lounge · Bengaluru</p>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-warning/10 border-b border-warning/20 px-4 py-2">
        <p className="text-xs text-center">
          <AlertTriangle size={12} className="inline mr-1" />
          {t('chat.disclaimer')}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {sharedMessages.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            <p className="mb-2 text-sm sm:text-base">{t('chat.welcomeMessage')}</p>
            <p className="text-xs sm:text-sm">{t('chat.welcomeSubtext')}</p>
          </div>
        )}
        
        {sharedMessages.map(renderMessage)}
        
        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xs bg-muted/50 border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 text-sm">💭</div>
                <span className="text-xs font-medium text-muted-foreground">
                  {typingUsers.length === 1 
                    ? `${typingUsers[0].nick} ${t('chat.typing')}`
                    : `${typingUsers.length} ${t('chat.typingMultiple')}`
                  }
                </span>
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-surface border-t px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 min-w-0">
            <Input
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.placeholder')}
              disabled={sending}
              maxLength={500}
              className="text-sm sm:text-base"
            />
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {getAvatarEmoji(session.avatarId)} {session.nick} • Anon • Moderated • On-site
            </p>
          </div>
          
          {/* Sticker picker */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11"
              onClick={() => setShowStickers(v => !v)}
              title="Send a sticker"
              aria-label="Send a sticker"
            >
              😊
            </Button>
            {showStickers && (
              <div className="absolute bottom-12 right-0 z-20 w-56 rounded-xl border bg-white shadow-xl p-2 grid grid-cols-4 gap-1">
                {stickers.map(s => (
                  <button
                    key={s.id}
                    className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-muted text-2xl"
                    title={s.label}
                    aria-label={s.label}
                    onClick={() => handleSendSticker(s.id)}
                  >
                    {s.glyph}
                  </button>
                ))}
              </div>
            )}
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
      
      {/* Exit Feedback Modal */}
      <Dialog open={showExitFeedback} onOpenChange={(open) => { if (!open) setShowExitFeedback(false); }}>
        <DialogContent className="sm:max-w-md">
          {feedbackStage === 'form' ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">{t('settings.feedbackTitle')}</DialogTitle>
                <DialogDescription className="text-center">
                  {t('settings.feedbackDesc')}
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
                    placeholder={t('settings.feedbackPlaceholder')}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowExitFeedback(false)}>
                    {t('settings.cancel')}
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={rating === null}
                    onClick={() => {
                      // TODO: send feedback to backend if available
                      setFeedbackStage('thanks');
                      setTimeout(() => {
                        setShowExitFeedback(false);
                        clearMessages();
                        setCurrentStep('landing');
                      }, 1200);
                    }}
                  >
                    {t('settings.submitExit')}
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle2 className="text-success" size={28} />
              </div>
              <div className="text-base font-medium mb-1">{t('settings.thankYou')}</div>
              <div className="text-xs text-muted-foreground">{t('settings.redirecting')}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}