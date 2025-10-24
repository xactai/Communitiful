import { Message } from './types';
import { supabase } from './supabaseClient';

export class RealtimeChatManager {
  private listeners: Set<(messages: Message[]) => void> = new Set();
  private roomId: string;
  private subscription: any = null;
  private currentMessages: Message[] = [];

  constructor(roomId: string = 'default') {
    this.roomId = roomId;
  }

  // Initialize real-time subscription
  async initialize() {
    // Subscribe to real-time changes
    this.subscription = supabase
      .channel(`chat-${this.roomId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `room_id=eq.${this.roomId}`
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          this.handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    // Load existing messages
    await this.loadMessages();
  }

  // Handle real-time updates
  private handleRealtimeUpdate(payload: any) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        if (newRecord) {
          const message = this.transformDatabaseMessage(newRecord);
          this.currentMessages.push(message);
          this.notifyListeners();
        }
        break;
      case 'UPDATE':
        if (newRecord) {
          const message = this.transformDatabaseMessage(newRecord);
          const index = this.currentMessages.findIndex(m => m.id === message.id);
          if (index >= 0) {
            this.currentMessages[index] = message;
            this.notifyListeners();
          }
        }
        break;
      case 'DELETE':
        if (oldRecord) {
          this.currentMessages = this.currentMessages.filter(m => m.id !== oldRecord.id);
          this.notifyListeners();
        }
        break;
    }
  }

  // Transform database message to app message format
  private transformDatabaseMessage(dbMessage: any): Message {
    return {
      id: dbMessage.id,
      clinicId: dbMessage.clinic_id,
      sessionId: dbMessage.session_id,
      authorType: dbMessage.author_type,
      text: dbMessage.text,
      createdAt: new Date(dbMessage.created_at),
      moderation: {
        status: dbMessage.moderation_status,
        reason: dbMessage.moderation_reason
      },
      companionIdentity: dbMessage.companion_identity ? JSON.parse(dbMessage.companion_identity) : undefined
    };
  }

  // Load existing messages from database
  private async loadMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', this.roomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      this.currentMessages = data.map(msg => this.transformDatabaseMessage(msg));
      this.notifyListeners();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  // Add a new message
  async addMessage(message: Message) {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          id: message.id,
          room_id: this.roomId,
          clinic_id: message.clinicId,
          session_id: message.sessionId,
          author_type: message.authorType,
          text: message.text,
          created_at: message.createdAt.toISOString(),
          moderation_status: message.moderation.status,
          moderation_reason: message.moderation.reason,
          companion_identity: message.companionIdentity ? JSON.stringify(message.companionIdentity) : null
        });

      if (error) {
        console.error('Error adding message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  // Update an existing message
  async updateMessage(messageId: string, updates: Partial<Message>) {
    try {
      const updateData: any = {};
      
      if (updates.moderation) {
        updateData.moderation_status = updates.moderation.status;
        updateData.moderation_reason = updates.moderation.reason;
      }
      
      if (updates.text) {
        updateData.text = updates.text;
      }

      const { error } = await supabase
        .from('messages')
        .update(updateData)
        .eq('id', messageId)
        .eq('room_id', this.roomId);

      if (error) {
        console.error('Error updating message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  // Remove a message
  async removeMessage(messageId: string) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('room_id', this.roomId);

      if (error) {
        console.error('Error removing message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error removing message:', error);
      throw error;
    }
  }

  // Get current messages
  getMessages(): Message[] {
    return [...this.currentMessages];
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

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getMessages());
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  // Clear all messages
  async clearMessages() {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('room_id', this.roomId);

      if (error) {
        console.error('Error clearing messages:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw error;
    }
  }

  // Get room info
  getRoomInfo() {
    return {
      roomId: this.roomId,
      messageCount: this.currentMessages.length
    };
  }

  // Cleanup
  destroy() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
    }
    this.listeners.clear();
  }
}

// Create room-specific real-time chat manager
export function createRealtimeChat(roomId: string) {
  return new RealtimeChatManager(roomId);
}

// Default instance
export const realtimeChat = new RealtimeChatManager('default');
