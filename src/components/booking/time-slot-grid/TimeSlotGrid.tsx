"use client";

import { useBookingStore } from "@/lib/store/booking";
import { TimeSlotGridSkeleton } from "./TimeSlotSkeleton";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { useDateRange } from "@/hooks/useDateRange";
import { useSlotsByDay } from "@/hooks/useSlotsByDay";
import { GridContainer } from "./GridContainer";
import { DateHeaders } from "./DateHeaders";
import { SlotsGrid } from "./SlotsGrid";
import { EmptyState } from "./EmptyState";

interface TimeSlotGridProps {
  height: number;
}

export function TimeSlotGrid({ height }: TimeSlotGridProps) {
  const { selectedDate, selectedRooms } = useBookingStore();
  const { allSlots, isInitialLoading } = useTimeSlots(
    selectedDate,
    selectedRooms
  );
  const dates = useDateRange(selectedDate);
  const slotsByDay = useSlotsByDay(dates, allSlots);

  if (selectedRooms.length === 0) {
    return <EmptyState />;
  }

  if (isInitialLoading) {
    return <TimeSlotGridSkeleton selectedDate={selectedDate} />;
  }

  return (
    <GridContainer>
      <DateHeaders dates={dates} />
      <SlotsGrid
        dates={dates}
        slotsByDay={slotsByDay}
        height={height - 40}
      />
    </GridContainer>
  );
}