'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { QueueAPI, QueueStatus, ActiveConnection } from '@/lib/api';

interface UseQueuePollingOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  onConnectionFound?: (connection: ActiveConnection) => void;
  onError?: (error: Error) => void;
}

export const useQueuePolling = (options: UseQueuePollingOptions = {}) => {
  const {
    enabled = true,
    interval = 3000, // 3 seconds
    onConnectionFound,
    onError,
  } = options;

  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastConnectionId = useRef<string | null>(null);

  const fetchQueueStatus = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const status = await QueueAPI.getQueueStatus();
      setQueueStatus(status);

      // Check for new connections
      if (status.activeConnection && status.activeConnection.id !== lastConnectionId.current) {
        lastConnectionId.current = status.activeConnection.id;
        onConnectionFound?.(status.activeConnection);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [enabled, onConnectionFound, onError]);

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling
    
    fetchQueueStatus(); // Immediate fetch
    intervalRef.current = setInterval(fetchQueueStatus, interval);
  }, [fetchQueueStatus, interval]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Effect to handle enabled state
  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [enabled, interval, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    queueStatus,
    isLoading,
    error,
    fetchQueueStatus,
    startPolling,
    stopPolling,
  };
};