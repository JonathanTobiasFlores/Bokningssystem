"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import { useBookingStore, type TimeSlot } from "@/lib/store/booking"

interface TimeSlotButtonProps {
  slot: TimeSlot
}

const TimeSlotButtonComponent = ({ slot }: TimeSlotButtonProps) => {
  const selectedSlot = useBookingStore(state => state.selectedSlot)
  const setSelectedSlot = useBookingStore(state => state.setSelectedSlot)
  
  const isSelected = selectedSlot === slot.id
  
  const handleClick = () => {
    if (slot.available) {
      setSelectedSlot(isSelected ? null : slot.id)
    }
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={!slot.available}
      className={cn(
        "flex flex-col justify-center text-left",
        "w-[99px] h-12 m-2 p-2",
        "border border-[#00695C] rounded-[4.41px]",
        "font-['Roboto',_sans-serif] font-normal text-sm leading-[16.8px]",
        "transition-all duration-200",
        
        // Normal state
        !isSelected && "bg-transparent text-[#1C1B1F] hover:bg-[#00695C]/10",
        
        // Selected state  
        isSelected && "bg-[#004D40] text-white",
        
        // Disabled state
        !slot.available && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="leading-[120%] truncate">
        {slot.roomName} ({slot.capacity})
      </span>
      <span className="leading-[120%] truncate">
        {slot.startTime}-{slot.endTime}
      </span>
    </button>
  )
}

export const TimeSlotButton = memo(TimeSlotButtonComponent, (prevProps: TimeSlotButtonProps, nextProps: TimeSlotButtonProps) => {
  return prevProps.slot.id === nextProps.slot.id && 
         prevProps.slot.available === nextProps.slot.available
}) 