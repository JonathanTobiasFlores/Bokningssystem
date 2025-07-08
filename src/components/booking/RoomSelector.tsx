"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

const rooms = [
  { id: "margret", name: "Margret", capacity: 4, checked: true },
  { id: "steve", name: "Steve", capacity: 6, checked: true },
  { id: "ada", name: "Ada", capacity: 10, checked: true },
  { id: "edmund", name: "Edmund", capacity: 10, checked: false },
  { id: "grace", name: "Grace", capacity: 20, checked: false },
];

export function RoomSelector() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="font-helvetica w-[164px] h-[45px] justify-between p-4 rounded-lg border border-[#BDBDBD] bg-background text-[#212121] text-[18px] font-normal hover:bg-gray-200 hover:text-[#212121]"
        >
          Mötesrum{" "}
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
        <div className="space-y-4">
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between">
                <label
                  htmlFor={room.id}
                  className="font-normal text-base leading-[1.2] tracking-[-0.01em] text-black"
                >
                  {room.name} ({room.capacity} personer)
                </label>
                <Checkbox id={room.id} checked={room.checked} />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="popoverSelect" size="popover">
              Välj
            </Button>
            <Button variant="popoverDeselect" size="popover">
              Avmarkera
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 