"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useBookingStore } from "@/lib/store/booking";
import { useRooms } from "@/hooks/useRooms";
import { RoomList } from "./RoomList";
import { RoomSelectorActions } from "./RoomSelectorActions";
import { RoomSelectorError } from "./RoomSelectorError";
import { RoomSelectorSkeleton } from "./RoomSelectorSkeleton";
import type { Room } from "@/lib/types/room.types";

// Trigger button component forwarding the native button ref
const RoomSelectorTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & { isOpen: boolean; triggerText: string }
>(({ isOpen, triggerText, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className="font-helvetica w-[164px] h-[45px] justify-between p-4 rounded-lg border border-[#BDBDBD] text-[#212121] text-[18px] font-normal hover:text-[#212121]"
    {...props}
  >
    {triggerText}{" "}
    <ChevronDown
      className={`h-4 w-4 transition-transform duration-200 ${
        isOpen ? "rotate-180" : ""
      }`}
    />
  </Button>
));
RoomSelectorTrigger.displayName = "RoomSelectorTrigger";

export function RoomSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedRooms, setSelectedRooms } = useBookingStore();
  const { rooms, isLoading, error, refetch } = useRooms({ enabled: isOpen });

  const handleRoomSelect = useCallback((room: Room) => {
    const isSelected = selectedRooms.some((r) => r.id === room.id);
    if (isSelected) {
      setSelectedRooms(selectedRooms.filter((r) => r.id !== room.id));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  }, [selectedRooms, setSelectedRooms]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedRooms([]);
  }, [setSelectedRooms]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const triggerText = useMemo(() => {
    const count = selectedRooms.length;
    if (count === 0) return "Mötesrum";
    if (count === 1) return "1 valt rum";
    return `${count} valda rum`;
  }, [selectedRooms]);

  const popoverContent = useMemo(() => {
    if (isLoading) return <RoomSelectorSkeleton />;
    
    if (error) {
      return (
        <RoomSelectorError 
          error={error} 
          onRetry={handleRetry} 
        />
      );
    }

    return (
      <div className="space-y-4">
        <RoomList
          rooms={rooms}
          selectedRooms={selectedRooms}
          onRoomSelect={handleRoomSelect}
        />
        <RoomSelectorActions
          onConfirm={handleConfirm}
          onDeselectAll={handleDeselectAll}
        />
      </div>
    );
  }, [
    isLoading, 
    error, 
    rooms, 
    selectedRooms, 
    handleRoomSelect, 
    handleConfirm, 
    handleDeselectAll,
    handleRetry
  ]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <RoomSelectorTrigger isOpen={isOpen} triggerText={triggerText} />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[345px] bg-[#ECECEC] border-[#BDBDBD] shadow-[0px_4px_16px_rgba(66,66,66,0.35)] rounded-lg p-6"
      >
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
}