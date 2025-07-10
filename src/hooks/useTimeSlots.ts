import { useState, useRef, useEffect } from 'react';
import { addDays } from 'date-fns';
import { toISOStringLocal, fromUTCDate } from '@/lib/utils/dateHelpers';
import { config } from '@/lib/config';
import type { TimeSlot } from '@/lib/store/booking';
import type { Room } from '@/lib/types/room.types';

type ApiTimeSlot = Omit<TimeSlot, 'date'> & { date: string };

export function useTimeSlots(selectedDate: Date, selectedRooms: Room[]) {
  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedRooms.length === 0) {
        setAllSlots([]);
        setIsInitialLoading(false);
        return;
      }

      // Cancel any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const startDate = selectedDate;
      const endDate = addDays(startDate, config.booking.navigationStep - 1);
      const roomIds = selectedRooms.map(r => r.id).join(',');

      const query = new URLSearchParams({
        startDate: toISOStringLocal(startDate),
        endDate: toISOStringLocal(endDate),
        roomIds,
      }).toString();

      try {
        const response = await fetch(`/api/timeslots?${query}`, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch time slots");
        }
        
        const data = await response.json();
        
        // Only update if this request wasn't aborted
        if (!abortController.signal.aborted) {
          const slotsWithDates = data.data.map((slot: ApiTimeSlot) => ({
            ...slot,
            date: fromUTCDate(slot.date),
          }));
          
          setAllSlots(slotsWithDates);
          setIsInitialLoading(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error(error);
          if (!abortController.signal.aborted) {
            setAllSlots([]);
            setIsInitialLoading(false);
          }
        }
      }
    };

    fetchSlots();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedDate, selectedRooms]);

  return { allSlots, isInitialLoading };
}