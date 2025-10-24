import { Session } from './types';

export interface UserPresence {
  sessionId: string;
  nick: string;
  avatarId: string;
  lastSeen: Date;
  isOnline: boolean;
  clinicId: string;
  isTyping?: boolean;
}

export class UserPresenceManager {
  private listeners: Set<(users: UserPresence[]) => void> = new Set();
  private broadcastChannel: BroadcastChannel;
  private roomId: string;
  private storageKey: string;
  private currentUser: Session | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private storageListener: (e: StorageEvent) => void;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(roomId: string = 'default') {
    this.roomId = roomId;
    this.storageKey = `user-presence-${roomId}`;
    this.broadcastChannel = new BroadcastChannel(`presence-${roomId}`);
    
    // Listen for presence updates from other tabs/windows
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'USER_JOIN' || event.data.type === 'USER_LEAVE' || event.data.type === 'USER_UPDATE') {
        this.notifyListeners(this.getOnlineUsers());
      }
    };

    // Listen for storage changes from other windows
    this.storageListener = (e: StorageEvent) => {
      if (e.key === this.storageKey) {
        this.notifyListeners(this.getOnlineUsers());
      }
    };
    window.addEventListener('storage', this.storageListener);

    // Start cleanup interval to remove stale users
    this.startCleanupInterval();
  }

  // Set current user and start heartbeat
  setCurrentUser(session: Session) {
    this.currentUser = session;
    this.addUser(session);
    this.startHeartbeat();
  }

  // Add user to presence
  private addUser(session: Session) {
    const users = this.getOnlineUsers();
    const existingUserIndex = users.findIndex(u => u.sessionId === session.id);
    
    const userPresence: UserPresence = {
      sessionId: session.id,
      nick: session.nick,
      avatarId: session.avatarId,
      lastSeen: new Date(),
      isOnline: true,
      clinicId: session.clinicId
    };

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = userPresence;
    } else {
      users.push(userPresence);
    }

    this.saveUsers(users);
    this.broadcastUserJoin(userPresence);
    this.notifyListeners(users);
  }

  // Update user heartbeat
  private updateUserHeartbeat() {
    if (!this.currentUser) return;

    const users = this.getOnlineUsers();
    const userIndex = users.findIndex(u => u.sessionId === this.currentUser!.id);
    
    if (userIndex >= 0) {
      users[userIndex].lastSeen = new Date();
      users[userIndex].isOnline = true;
      this.saveUsers(users);
      this.broadcastUserUpdate(users[userIndex]);
    }
  }

  // Start heartbeat to keep user online
  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.updateUserHeartbeat();
    }, 30000); // Update every 30 seconds
  }

  // Remove current user
  removeCurrentUser() {
    if (!this.currentUser) return;

    const users = this.getOnlineUsers();
    const filteredUsers = users.filter(u => u.sessionId !== this.currentUser!.id);
    
    this.saveUsers(filteredUsers);
    this.broadcastUserLeave(this.currentUser.id);
    this.notifyListeners(filteredUsers);

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    this.currentUser = null;
  }

  // Get online users
  getOnlineUsers(): UserPresence[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const users = JSON.parse(stored).map((user: any) => ({
        ...user,
        lastSeen: new Date(user.lastSeen)
      }));
      
      return users;
    } catch (error) {
      console.error('Failed to parse user presence:', error);
      return [];
    }
  }

  // Save users to localStorage
  private saveUsers(users: UserPresence[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save user presence:', error);
    }
  }

  // Start cleanup interval to remove stale users
  private startCleanupInterval() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleUsers();
    }, 60000); // Cleanup every minute
  }

  // Remove users who haven't been seen for more than 2 minutes
  private cleanupStaleUsers() {
    const users = this.getOnlineUsers();
    const now = new Date();
    const staleThreshold = 2 * 60 * 1000; // 2 minutes

    const activeUsers = users.filter(user => {
      const timeSinceLastSeen = now.getTime() - user.lastSeen.getTime();
      return timeSinceLastSeen < staleThreshold;
    });

    if (activeUsers.length !== users.length) {
      this.saveUsers(activeUsers);
      this.notifyListeners(activeUsers);
    }
  }

  // Subscribe to presence updates
  subscribe(callback: (users: UserPresence[]) => void) {
    this.listeners.add(callback);
    // Immediately call with current users
    callback(this.getOnlineUsers());
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of presence updates
  private notifyListeners(users: UserPresence[]) {
    this.listeners.forEach(callback => {
      try {
        callback(users);
      } catch (error) {
        console.error('Error notifying presence listener:', error);
      }
    });
  }

  // Broadcast user join
  private broadcastUserJoin(user: UserPresence) {
    this.broadcastChannel.postMessage({
      type: 'USER_JOIN',
      user,
      timestamp: Date.now()
    });
  }

  // Broadcast user leave
  private broadcastUserLeave(sessionId: string) {
    this.broadcastChannel.postMessage({
      type: 'USER_LEAVE',
      sessionId,
      timestamp: Date.now()
    });
  }

  // Broadcast user update
  private broadcastUserUpdate(user: UserPresence) {
    this.broadcastChannel.postMessage({
      type: 'USER_UPDATE',
      user,
      timestamp: Date.now()
    });
  }

  // Set typing status for current user
  setTypingStatus(isTyping: boolean) {
    if (!this.currentUser) return;

    const users = this.getOnlineUsers();
    const userIndex = users.findIndex(u => u.sessionId === this.currentUser!.id);
    
    if (userIndex >= 0) {
      users[userIndex].isTyping = isTyping;
      this.saveUsers(users);
      this.broadcastUserUpdate(users[userIndex]);
    }
  }

  // Get users who are currently typing
  getTypingUsers(): UserPresence[] {
    return this.getOnlineUsers().filter(user => user.isTyping && user.sessionId !== this.currentUser?.id);
  }

  // Get online user count
  getOnlineUserCount(): number {
    return this.getOnlineUsers().length;
  }

  // Cleanup
  destroy() {
    this.removeCurrentUser();
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.broadcastChannel.close();
    this.listeners.clear();
    window.removeEventListener('storage', this.storageListener);
  }
}

// Create room-specific presence manager
export function createUserPresenceManager(roomId: string) {
  return new UserPresenceManager(roomId);
}

// Default instance for backward compatibility
export const userPresence = new UserPresenceManager('default');
