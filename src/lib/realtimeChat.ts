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
    try {
      // First, try to load existing messages to check if table exists
      await this.loadMessages();
      
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

      console.log('Real-time chat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize real-time chat:', error);
      throw new Error('Real-time chat initialization failed. Please ensure the messages table exists in your Supabase database.');
    }
  }

  // Handle real-time updates
  private handleRealtimeUpdate(payload: any) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        if (newRecord) {
          const message = this.transformDatabaseMessage(newRecord);
          this.upsertMessage(message);
        }
        break;
      case 'UPDATE':
        if (newRecord) {
          const message = this.transformDatabaseMessage(newRecord);
          this.upsertMessage(message);
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
      companionIdentity: dbMessage.companion_identity ? JSON.parse(dbMessage.companion_identity) : undefined,
      replyTo: dbMessage.reply_to 
        ? (typeof dbMessage.reply_to === 'string' ? JSON.parse(dbMessage.reply_to) : dbMessage.reply_to)
        : undefined,
      reactions: dbMessage.reactions
        ? (typeof dbMessage.reactions === 'string' ? JSON.parse(dbMessage.reactions) : dbMessage.reactions)
        : undefined
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
        if (error.message.includes('relation "public.messages" does not exist')) {
          throw new Error('Messages table does not exist. Please run the database migration first.');
        }
        throw error;
      }

      const uniqueMessages = data
        .map(msg => this.transformDatabaseMessage(msg))
        .reduce<Map<string, Message>>((map, message) => {
          map.set(message.id, message);
          return map;
        }, new Map());
      
      this.currentMessages = Array.from(uniqueMessages.values()).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
      this.notifyListeners();
    } catch (error) {
      console.error('Error loading messages:', error);
      throw error;
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
          companion_identity: message.companionIdentity ? JSON.stringify(message.companionIdentity) : null,
          reply_to: message.replyTo ? JSON.stringify(message.replyTo) : null,
          reactions: message.reactions ? JSON.stringify(message.reactions) : null
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
      
      if (updates.reactions !== undefined) {
        updateData.reactions = updates.reactions ? JSON.stringify(updates.reactions) : null;
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

  // Check if database table exists
  async checkDatabaseHealth() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .limit(1);

      if (error) {
        if (error.message.includes('relation "public.messages" does not exist')) {
          return {
            status: 'error',
            message: 'Messages table does not exist. Please run the database migration.',
            solution: 'Run the SQL script in DATABASE_SETUP_GUIDE.md in your Supabase dashboard.'
          };
        }
        return {
          status: 'error',
          message: `Database error: ${error.message}`,
          solution: 'Check your Supabase connection and permissions.'
        };
      }

      return {
        status: 'success',
        message: 'Database table exists and is accessible.',
        solution: 'Real-time chat should work correctly.'
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Connection error: ${error}`,
        solution: 'Check your Supabase URL and API key.'
      };
    }
  }

  // Helper functions
  private upsertMessage(message: Message) {
    const index = this.currentMessages.findIndex(m => m.id === message.id);
    
    if (index >= 0) {
      this.currentMessages[index] = message;
    } else {
      this.currentMessages.push(message);
    }
    
    this.currentMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    this.notifyListeners();
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
