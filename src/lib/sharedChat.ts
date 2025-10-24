import { Message } from './types';
import { UserPresenceManager } from './userPresence';

export class SharedChatManager {
  private listeners: Set<(messages: Message[]) => void> = new Set();
  private broadcastChannel: BroadcastChannel;
  private roomId: string;
  private storageKey: string;
  private lastMessageTimestamp = 0;
  private storageListener: (e: StorageEvent) => void;
  private userPresence: UserPresenceManager;

  constructor(roomId: string = 'default') {
    this.roomId = roomId;
    this.storageKey = `shared-chat-${roomId}`;
    this.broadcastChannel = new BroadcastChannel(`chat-room-${roomId}`);
    this.userPresence = new UserPresenceManager(roomId);
    
    // Listen for messages from other tabs/windows
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'NEW_MESSAGE' || event.data.type === 'MESSAGE_UPDATE' || event.data.type === 'MESSAGE_REMOVE') {
        this.notifyListeners(this.getMessages());
      } else if (event.data.type === 'CLEAR_MESSAGES') {
        this.notifyListeners([]);
      }
    };

    // Listen for storage changes from other windows
    this.storageListener = (e: StorageEvent) => {
      if (e.key === this.storageKey) {
        this.notifyListeners(this.getMessages());
      }
    };
    window.addEventListener('storage', this.storageListener);
  }

  // Add a message to shared storage
  addMessage(message: Message) {
    const messages = this.getMessages();
    messages.push(message);
    this.saveMessages(messages);
    
    // Broadcast to other tabs immediately
    this.broadcastChannel.postMessage({
      type: 'NEW_MESSAGE',
      message,
      timestamp: Date.now()
    });
    
    this.notifyListeners(messages);
  }

  // Update an existing message
  updateMessage(messageId: string, updates: Partial<Message>) {
    const messages = this.getMessages();
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    );
    
    this.saveMessages(updatedMessages);
    
    // Broadcast update to other tabs
    this.broadcastChannel.postMessage({
      type: 'MESSAGE_UPDATE',
      messageId,
      updates,
      timestamp: Date.now()
    });
    
    this.notifyListeners(updatedMessages);
  }

  // Remove a message
  removeMessage(messageId: string) {
    const messages = this.getMessages();
    const filteredMessages = messages.filter(msg => msg.id !== messageId);
    
    this.saveMessages(filteredMessages);
    
    // Broadcast removal to other tabs
    this.broadcastChannel.postMessage({
      type: 'MESSAGE_REMOVE',
      messageId,
      timestamp: Date.now()
    });
    
    this.notifyListeners(filteredMessages);
  }

  // Get all messages from shared storage
  getMessages(): Message[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const messages = JSON.parse(stored).map((msg: any) => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
      }));
      
      // Sort by creation time to ensure consistent order
      return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } catch (error) {
      console.error('Failed to parse shared messages:', error);
      return [];
    }
  }

  // Save messages to localStorage
  private saveMessages(messages: Message[]) {
    try {
      // Keep only last 100 messages to prevent storage bloat
      const recentMessages = messages.slice(-100);
      localStorage.setItem(this.storageKey, JSON.stringify(recentMessages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  // Subscribe to message updates
  subscribe(callback: (messages: Message[]) => void) {
    this.listeners.add(callback);
    // Immediately call with current messages
    callback(this.getMessages());
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of message updates
  private notifyListeners(messages: Message[]) {
    this.listeners.forEach(callback => {
      try {
        callback(messages);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  // Clear all messages (for testing or reset)
  clearMessages() {
    localStorage.removeItem(this.storageKey);
    
    // Broadcast clear to other tabs
    this.broadcastChannel.postMessage({
      type: 'CLEAR_MESSAGES',
      timestamp: Date.now()
    });
    
    this.notifyListeners([]);
  }

  // Get room info
  getRoomInfo() {
    return {
      roomId: this.roomId,
      messageCount: this.getMessages().length,
      onlineUserCount: this.userPresence.getOnlineUserCount()
    };
  }

  // Set current user for presence tracking
  setCurrentUser(session: any) {
    this.userPresence.setCurrentUser(session);
  }

  // Remove current user from presence
  removeCurrentUser() {
    this.userPresence.removeCurrentUser();
  }

  // Subscribe to user presence updates
  subscribeToPresence(callback: (users: any[]) => void) {
    return this.userPresence.subscribe(callback);
  }

  // Get online user count
  getOnlineUserCount(): number {
    return this.userPresence.getOnlineUserCount();
  }

  // Set typing status for current user
  setTypingStatus(isTyping: boolean) {
    this.userPresence.setTypingStatus(isTyping);
  }

  // Get users who are currently typing
  getTypingUsers() {
    return this.userPresence.getTypingUsers();
  }

  // Cleanup
  destroy() {
    this.userPresence.destroy();
    this.broadcastChannel.close();
    this.listeners.clear();
    window.removeEventListener('storage', this.storageListener);
  }
}

// Create room-specific chat manager
export function createSharedChat(roomId: string) {
  return new SharedChatManager(roomId);
}

// Default instance for backward compatibility
export const sharedChat = new SharedChatManager('default');