import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { sharedChat } from '@/lib/sharedChat';
import { realtimeChat } from '@/lib/realtimeChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { Settings, Send, AlertTriangle, MessageCircle, Users } from 'lucide-react';
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

interface ChatProps {
  onOpenSettings: () => void;
  onOpenRelaxation: () => void;
}

export function Chat({ onOpenSettings, onOpenRelaxation }: ChatProps) {
  const { session, addMessage, updateMessage, incrementUserMessageCount } = useAppStore();
  const [sharedMessages, setSharedMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [rateLimiter] = useState(() => new RateLimiter(5, 60000)); // 5 messages per minute
  const [showModerationBanner, setShowModerationBanner] = useState(false);
  const [moderationMessage, setModerationMessage] = useState("Moderation Notice");
  const [moderationType, setModerationType] = useState<'block' | 'warn' | 'safety'>('warn');
  const [moderationSuggestions, setModerationSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [defaultMessagesLoaded, setDefaultMessagesLoaded] = useState(false);
  const lastUserMessageTimeRef = useRef<number>(Date.now());
  const [showUserJoinNotification, setShowUserJoinNotification] = useState(false);
  const [userJoinMessage, setUserJoinMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<UserPresence[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
        setUserJoinMessage(`${newCount - previousCount} companion${newCount - previousCount > 1 ? 's' : ''} joined the chat`);
        setShowUserJoinNotification(true);
        setTimeout(() => setShowUserJoinNotification(false), 3000);
      } else if (previousCount > 0 && newCount < previousCount) {
        setUserJoinMessage(`${previousCount - newCount} companion${previousCount - newCount > 1 ? 's' : ''} left the chat`);
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
        
        {/* Online Users Count */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          <Users size={12} />
          <span>{onlineUsers.length} online</span>
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
          This chat is for emotional sharing and companionship, not medical advice.
          In emergencies, please contact hospital staff.
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
        
        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xs bg-muted/50 border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 text-sm">💭</div>
                <span className="text-xs font-medium text-muted-foreground">
                  {typingUsers.length === 1 
                    ? `${typingUsers[0].nick} is typing...`
                    : `${typingUsers.length} companions are typing...`
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