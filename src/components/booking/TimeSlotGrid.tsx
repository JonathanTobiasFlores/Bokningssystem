"use client";

import { useBookingStore } from "@/lib/store/booking";
import { format, addDays, startOfDay, isToday, parse } from "date-fns";
import { toISOStringLocal, fromUTCDate, getZonedTime } from "@/lib/utils/dateHelpers";
import { sv } from "date-fns/locale";
import React, { memo } from "react";
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

export function TimeSlotGrid({ height }: TimeSlotGridProps) {
  const { selectedDate, selectedRooms } = useBookingStore();
  const [allSlots, setAllSlots] = React.useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSlots = async () => {
      if (selectedRooms.length === 0) {
        setAllSlots([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const startDate = selectedDate;
      const endDate = addDays(startDate, config.booking.navigationStep - 1);
      const roomIds = selectedRooms.map(r => r.id).join(',');

      const query = new URLSearchParams({
        startDate: toISOStringLocal(startDate),
        endDate: toISOStringLocal(endDate),
        roomIds,
      }).toString();

      try {
        const response = await fetch(`/api/timeslots?${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch time slots");
        }
        const data = await response.json();
        // The API returns dates as strings, so we need to convert them back to Date objects
        const slotsWithDates = data.data.map((slot: any) => ({
          ...slot,
          date: fromUTCDate(slot.date),
        }));
        setAllSlots(slotsWithDates);
      } catch (error) {
        console.error(error);
        setAllSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedRooms]);

  const dates = Array.from(
    { length: config.booking.navigationStep },
    (_, i) => addDays(selectedDate, i)
  );

  if (selectedRooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border border-[#BDBDBD] rounded-lg">
        <p className="text-gray-500 text-center">
          Välj ett eller flera mötesrum för att se tillgängliga tider.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <TimeSlotGridSkeleton selectedDate={selectedDate} />;
  }
  
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`,
  };

  return (
    <div className="border border-[#BDBDBD] rounded-lg">
      {/* Date headers */}
      <div style={gridStyle} className="border-b border-[#BDBDBD]">
        {dates.map((date, index) => (
          <DateHeader key={index} date={date} />
        ))}
      </div>

      {/* Time slots with virtualized git ing */}
      <div style={{ ...gridStyle, height: `${height - 40}px` }}>
        {dates.map((date) => {
          let daySlots = allSlots.filter(
            (slot) =>
              startOfDay(slot.date).getTime() === startOfDay(date).getTime()
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
              
              if (now > slotDateTime) {
                return { ...slot, available: false };
              }
              return slot;
            })
          }

          return (
            <VirtualizedDayColumn
              key={date.toISOString()}
              daySlots={daySlots}
              height={height - 40}
            />
          );
        })}
      </div>
    </div>
  );
}