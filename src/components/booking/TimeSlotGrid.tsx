"use client";

import { useBookingStore } from "@/lib/store/booking";
import { format, addDays, startOfDay, isToday, parse } from "date-fns";
import { toISOStringLocal, fromUTCDate, getZonedTime } from "@/lib/utils/dateHelpers";
import { sv } from "date-fns/locale";
import React, { memo, useRef, useEffect, useMemo } from "react";
import { VirtualizedDayColumn } from "@/components/booking/VirtualizedDayColumn";
import { config } from "@/lib/config";
import type { TimeSlot } from "@/lib/store/booking";
import { TimeSlotGridSkeleton } from "./TimeSlotSkeleton";

interface TimeSlotGridProps {
  height: number;
}

const DateHeader = memo(({ date }: { date: Date }) => (
  <div className="text-center p-2 font-medium capitalize border-r border-[#BDBDBD] last:border-r-0">
    {format(date, "eee d", { locale: sv })}
  </div>
));
DateHeader.displayName = "DateHeader";

// Memoized grid container to prevent re-render
const GridContainer = memo(({ 
  children, 
  columns 
}: { 
  children: React.ReactNode; 
  columns: number;
}) => {
  const gridStyle = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  }), [columns]);

  return (
    <div className="border border-[#BDBDBD] rounded-lg">
      {children}
    </div>
  );
});
GridContainer.displayName = "GridContainer";

// Memoized date headers section
const DateHeaders = memo(({ dates }: { dates: Date[] }) => {
  const gridStyle = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`,
  }), [dates.length]);

  return (
    <div style={gridStyle} className="border-b border-[#BDBDBD]">
      {dates.map((date, index) => (
        <DateHeader key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`} date={date} />
      ))}
    </div>
  );
});
DateHeaders.displayName = "DateHeaders";

// Memoized slots grid with stable references
const SlotsGrid = memo(({ 
  dates, 
  slotsByDay, 
  height 
}: { 
  dates: Date[]; 
  slotsByDay: Map<string, TimeSlot[]>; 
  height: number;
}) => {
  const [opacity, setOpacity] = React.useState(0);

  useEffect(() => {
    // Use requestAnimationFrame to ensure the transition happens on the next frame
    const animationFrameId = requestAnimationFrame(() => {
      setOpacity(1);
    });
    return () => cancelAnimationFrame(animationFrameId);
  }, []); // Run only on mount

  const gridStyle = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`,
    height: `${height}px`,
    opacity: opacity,
    transition: 'opacity 300ms ease-in-out',
  }), [dates.length, height, opacity]);

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

export function TimeSlotGrid({ height }: TimeSlotGridProps) {
  const { selectedDate, selectedRooms } = useBookingStore();
  const [allSlots, setAllSlots] = React.useState<TimeSlot[]>([]);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousSlotsRef = useRef<TimeSlot[]>([]);

  // Memoize dates array to prevent recreation on every render
  const dates = useMemo(() => 
    Array.from(
      { length: config.booking.navigationStep },
      (_, i) => addDays(selectedDate, i)
    ),
    [selectedDate]
  );

  // Memoize slots by day to prevent recreation
  const slotsByDay = useMemo(() => {
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
          const slotsWithDates = data.data.map((slot: any) => ({
            ...slot,
            date: fromUTCDate(slot.date),
          }));
          
          // Only update if data actually changed
          const hasChanged = JSON.stringify(slotsWithDates) !== JSON.stringify(previousSlotsRef.current);
          if (hasChanged) {
            previousSlotsRef.current = slotsWithDates;
            setAllSlots(slotsWithDates);
          }
          setIsInitialLoading(false);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
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

  if (selectedRooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border border-[#BDBDBD] rounded-lg">
        <p className="text-gray-500 text-center">
          Välj ett eller flera mötesrum för att se tillgängliga tider.
        </p>
      </div>
    );
  }

  if (isInitialLoading && selectedRooms.length > 0) {
    return <TimeSlotGridSkeleton selectedDate={selectedDate} />;
  }

  return (
    <GridContainer columns={dates.length}>
      <DateHeaders dates={dates} />
      <SlotsGrid 
        key={selectedDate.toISOString()} // Add key to re-mount and trigger animation
        dates={dates} 
        slotsByDay={slotsByDay} 
        height={height - 40} 
      />
    </GridContainer>
  );
}