import { useState, useEffect, useCallback } from 'react';
import type { Room } from '@/lib/types/room.types';

interface UseRoomsReturn {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRooms(options: { enabled: boolean }): UseRoomsReturn {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    const abortController = new AbortController();
    
    // Only show loading skeleton on initial load
    if (rooms.length === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch('/api/rooms', { 
        signal: abortController.signal 
      });
      
      if (!response.ok) {
        throw new Error('Kunde inte hämta rummen. Försök igen.');
      }
      
      const data = await response.json();
      
      if (!abortController.signal.aborted) {
        setRooms(data.data);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error.message);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }

    return () => abortController.abort();
  }, [rooms.length]);

  useEffect(() => {
    if (options.enabled) {
      fetchRooms();
    }
  }, [options.enabled, fetchRooms]);

  const refetch = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, isLoading, error, refetch };
}