import { memo, useMemo } from 'react';
import { startOfDay } from 'date-fns';
import { VirtualizedDayColumn } from './VirtualizedDayColumn';
import type { TimeSlot } from '@/lib/store/booking';

interface SlotsGridProps {
  dates: Date[];
  slotsByDay: Map<string, TimeSlot[]>;
  height: number;
}

export const SlotsGrid = memo(({ 
  dates, 
  slotsByDay, 
  height 
}: SlotsGridProps) => {
  const gridStyle = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`,
    height: `${height}px`,
  }), [dates.length, height]);

  return (
    <div style={gridStyle}>
      {dates.map((date) => {
        const dateKey = startOfDay(date).toISOString();
        const daySlots = slotsByDay.get(dateKey) || [];

        return (
          <VirtualizedDayColumn
            key={dateKey}
            daySlots={daySlots}
            height={height}
          />
        );
      })}
    </div>
  );
});
SlotsGrid.displayName = "SlotsGrid";