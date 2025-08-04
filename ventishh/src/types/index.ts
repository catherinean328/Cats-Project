// User types for the Ventishh platform
export interface User {
  id: string;
  role: 'listener' | 'venter';
  isOnline: boolean;
  telegramUsername?: string; // Only required for listeners
  createdAt: Date;
}

// Queue system types
export interface QueueStatus {
  position: number;
  estimatedWaitTime: number;
  totalWaiting: number;
}

// Call connection types  
export interface CallConnection {
  id: string;
  listenerUser: User;
  venterUser: User;
  status: 'connecting' | 'connected' | 'ended';
  startedAt: Date;
  endedAt?: Date;
}

// Debug info for queue management
export interface DebugInfo {
  role: 'listener' | 'venter';
  listeners: number;
  venters: number;
  listenersData: Array<{ id: string; username?: string }>;
  ventersData: Array<{ id: string }>;
}

// Socket event types
export interface SocketEvents {
  'user-joined': (user: User) => void;
  'user-left': (userId: string) => void;
  'queue-update': (status: QueueStatus) => void;
  'match-found': (connection: CallConnection) => void;
  'call-ended': (connectionId: string) => void;
  'debug-info': (info: DebugInfo) => void;
}