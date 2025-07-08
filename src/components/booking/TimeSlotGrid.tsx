"use client";

import { useBookingStore } from "@/lib/store/booking";
import { format, addDays, startOfDay } from "date-fns";
import { sv } from "date-fns/locale";
import { memo } from "react";
import { VirtualizedDayColumn } from "@/components/booking/VirtualizedDayColumn";
import { config } from "@/lib/config";
import type { TimeSlot } from "@/lib/store/booking";

interface TimeSlotGridProps {
  height: number;
}

const DateHeader = memo(({ date }: { date: Date }) => (
  <div className="py-2 text-center font-medium text-base border-r border-[#BDBDBD] last:border-r-0">
    {format(date, "d MMM", { locale: sv })}
  </div>
));
DateHeader.displayName = "DateHeader";

// Hard-coded sample data for a week
const generateSampleTimeSlots = (startDate: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const rooms = ["Margret", "Steve", "Ada", "Edmund", "Grace"];
  for (let day = 0; day < 7; day++) {
    const currentDate = addDays(startOfDay(startDate), day);
    for (let hour = 8; hour < 17; hour++) {
      rooms.forEach((roomName, roomIndex) => {
        slots.push({
          id: `${day}-${hour}-${roomIndex}`,
          roomName,
          capacity: (roomIndex + 1) * 2,
          startTime: `${String(hour).padStart(2, '0')}:00`,
          endTime: `${String(hour + 1).padStart(2, '0')}:00`,
          date: currentDate,
          available: Math.random() > 0.3, // 70% available
        });
      });
    }
  }
  return slots;
};


export function TimeSlotGrid({ height }: TimeSlotGridProps) {
  const { selectedDate, selectedRooms } = useBookingStore();
  
  const dates = Array.from({ length: config.booking.navigationStep }, (_, i) => addDays(selectedDate, i));
  const allSlots = generateSampleTimeSlots(selectedDate);

  if (selectedRooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border border-[#BDBDBD] rounded-lg">
        <p className="text-gray-500 text-center">Välj ett eller flera mötesrum för att se tillgängliga tider.</p>
      </div>
    );
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`,
  }

  return (
    <div className="border border-[#BDBDBD] rounded-lg">
      {/* Date headers */}
      <div style={gridStyle} className="border-b border-[#BDBDBD]">
        {dates.map((date, index) => (
          <DateHeader key={index} date={date} />
        ))}
      </div>
      
      {/* Time slots with virtualized scrolling */}
      <div style={{...gridStyle, height: `${height - 40}px` }}> {/* Subtract header height */}
        {dates.map((date) => {
            const daySlots = allSlots.filter(slot => 
                slot.date.getTime() === date.getTime() &&
                selectedRooms.some(room => room.name === slot.roomName)
            );
            return (
                <VirtualizedDayColumn
                    key={date.toISOString()}
                    daySlots={daySlots}
                    height={height - 40} // Pass down remaining height
                />
            )
        })}
      </div>
    </div>
  )
}