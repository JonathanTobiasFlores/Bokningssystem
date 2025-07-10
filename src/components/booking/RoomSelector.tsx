"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Loader2 } from "lucide-react";
import { useBookingStore } from "@/lib/store/booking";
import type { Room } from "@/lib/types/room.types";
import { useEffect, useState, useMemo } from "react";

export function RoomSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedRooms, setSelectedRooms } = useBookingStore();

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setAllRooms(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen]);

  const handleRoomSelect = (room: Room) => {
    const isSelected = selectedRooms.some((r) => r.id === room.id);
    if (isSelected) {
      setSelectedRooms(selectedRooms.filter((r) => r.id !== room.id));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
  }

  const handleDeselectAll = () => {
    setSelectedRooms([]);
  }

  const triggerText = useMemo(() => {
    const count = selectedRooms.length;
    if (count === 0) {
      return "Mötesrum";
    }
    if (count === 1) {
      return "1 valt rum";
    }
    return `${count} valda rum`;
  }, [selectedRooms]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="font-helvetica w-[164px] h-[45px] justify-between p-4 rounded-lg border border-[#BDBDBD] text-[#212121] text-[18px] font-normal hover:text-[#212121]"
        >
          {triggerText}{" "}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[345px] bg-[#ECECEC] border-[#BDBDBD] shadow-[0px_4px_16px_rgba(66,66,66,0.35)] rounded-lg p-6"
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[280px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 hide-scrollbar">
              {allRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between"
                >
                  <label
                    htmlFor={String(room.id)}
                    className="font-normal text-base leading-[1.2] tracking-[-0.01em] text-black"
                  >
                    {room.name} ({room.capacity} personer)
                  </label>
                  <Checkbox
                    id={String(room.id)}
                    checked={selectedRooms.some((r) => r.id === room.id)}
                    onCheckedChange={() => handleRoomSelect(room)}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4">
              <Button
                onClick={handleConfirm}
                className="w-[145px] h-[48px] p-4 rounded-2xl bg-[#1D1D1D] text-white border border-white/10 backdrop-blur-[25px] flex items-center justify-center"
              >
                Välj
              </Button>
              <Button
                onClick={handleDeselectAll}
                className="w-[145px] h-[48px] p-4 rounded-2xl bg-[#3C3C3C] text-white border border-white/10 backdrop-blur-[25px] flex items-center justify-center"
              >
                Avmarkera
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
} 