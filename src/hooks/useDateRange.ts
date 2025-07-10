import { useMemo } from 'react';
import { addDays } from 'date-fns';
import { config } from '@/lib/config';

export function useDateRange(selectedDate: Date) {
  return useMemo(() => 
    Array.from(
      { length: config.booking.navigationStep },
      (_, i) => addDays(selectedDate, i)
    ),
    [selectedDate]
  );
}