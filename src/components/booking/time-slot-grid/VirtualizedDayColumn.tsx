"use client"

import { memo, useRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import { TimeSlotButton } from "./TimeSlotButton"
import type { TimeSlot } from "@/lib/store/booking";

interface VirtualizedDayColumnProps {
  daySlots: TimeSlot[]
  height: number;
  columnIndex?: number;
}

// Item renderer for react-window
const ItemRenderer = memo(({ 
  index, 
  style, 
  data 
}: { 
  index: number
  style: React.CSSProperties
  data: { daySlots: TimeSlot[], columnIndex: number }
}) => {
  const slot = data.daySlots[index]
  if (!slot) return null
  
  return (
    <div 
      style={{
        ...style,
        animation: `fadeIn 400ms ease-in-out`
      }} 
      className="flex justify-center"
    >
      <TimeSlotButton slot={slot} />
    </div>
  )
})
ItemRenderer.displayName = 'ItemRenderer'

const areEqual = (prevProps: VirtualizedDayColumnProps, nextProps: VirtualizedDayColumnProps) => {
    if (prevProps.height !== nextProps.height) {
        return false;
    }
    if (prevProps.daySlots.length !== nextProps.daySlots.length) {
        return false;
    }
    for (let i = 0; i < prevProps.daySlots.length; i++) {
        if (prevProps.daySlots[i].id !== nextProps.daySlots[i].id || 
            prevProps.daySlots[i].available !== nextProps.daySlots[i].available) {
            return false;
        }
    }
    return true;
}

const VirtualizedDayColumnComponent = ({ 
  daySlots,
  height,
  columnIndex = 0,
}: VirtualizedDayColumnProps) => {
  const listRef = useRef<List>(null)
  
  const ITEM_SIZE = 58; // 48px button height + 10px spacing
  
  if (daySlots.length === 0) {
    return (
      <div className="border-r border-[#BDBDBD] last:border-r-0 h-full">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500 text-sm">
            Inga tider tillgängliga
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="border-r border-[#BDBDBD] last:border-r-0">
      <List
        ref={listRef}
        height={height}
        itemCount={daySlots.length}
        itemSize={ITEM_SIZE}
        itemData={{ daySlots, columnIndex }}
        itemKey={(index, data) => data.daySlots[index].id}
        width="100%"
        className="scrollbar-hide"
      >
        {ItemRenderer}
      </List>
    </div>
  )
}

export const VirtualizedDayColumn = memo(VirtualizedDayColumnComponent, areEqual);
VirtualizedDayColumn.displayName = "VirtualizedDayColumn"