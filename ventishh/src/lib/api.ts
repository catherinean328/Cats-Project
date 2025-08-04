'use client';

import { QueueUser, Connection } from '@/lib/db';

// Generate a session ID for the browser
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('ventishh_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('ventishh_session_id', sessionId);
  }
  return sessionId;
}

// API client for queue management
export class QueueAPI {
  static async joinQueue(role: 'listener' | 'venter', telegramUsername?: string) {
    const sessionId = getSessionId();
    
    const response = await fetch('/api/queue/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        role,
        telegramUsername,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join queue');
    }

    return response.json();
  }

  static async leaveQueue() {
    const sessionId = getSessionId();
    
    const response = await fetch('/api/queue/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to leave queue');
    }

    return response.json();
  }

  static async getQueueStatus() {
    const sessionId = getSessionId();
    
    const response = await fetch(`/api/queue/status?sessionId=${sessionId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get queue status');
    }

    return response.json();
  }

  static async endConnection(connectionId: string) {
    const response = await fetch('/api/connections/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to end connection');
    }

    return response.json();
  }
}

// Types for the API responses
export interface QueueStatus {
  listeners: {
    count: number;
    data: Array<{
      id: string;
      username?: string;
      joinedAt: string;
    }>;
  };
  venters: {
    count: number;
    data: Array<{
      id: string;
      joinedAt: string;
    }>;
  };
  activeConnection?: Connection & {
    listenerUser: QueueUser;
    venterUser: QueueUser;
  };
}

export interface JoinQueueResponse {
  user: QueueUser;
  matched: boolean;
  connection?: Connection & {
    listenerUser: QueueUser;
    venterUser: QueueUser;
  };
}