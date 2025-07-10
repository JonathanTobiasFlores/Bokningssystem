import { useMemo } from 'react';
import { startOfDay, isToday, parse } from 'date-fns';
import { getZonedTime } from '@/lib/utils/dateHelpers';
import type { TimeSlot } from '@/lib/store/booking';

export function useSlotsByDay(dates: Date[], allSlots: TimeSlot[]) {
  return useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    
    dates.forEach(date => {
      const dateKey = startOfDay(date).toISOString();
      let daySlots = allSlots.filter(
        slot => startOfDay(slot.date).getTime() === startOfDay(date).getTime()
      );

      // Disable past time slots for today
      if (isToday(date)) {
        const now = getZonedTime(new Date());
        daySlots = daySlots.map(slot => {
          const slotStartTime = parse(slot.startTime, 'HH:mm', new Date());
          const slotDateTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            slotStartTime.getHours(),
            slotStartTime.getMinutes()
          );
          
          // Only create new object if availability changed
          const shouldBeAvailable = now <= slotDateTime;
          if (slot.available !== shouldBeAvailable) {
            return { ...slot, available: shouldBeAvailable };
          }
          return slot;
        });
      }

      map.set(dateKey, daySlots);
    });

    return map;
  }, [dates, allSlots]);
}