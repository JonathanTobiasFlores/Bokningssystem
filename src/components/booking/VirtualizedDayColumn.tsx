"use client"

import { memo, useRef, useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'
import { TimeSlotButton } from "./TimeSlotButton"

interface TimeSlot {
  id: string
  roomName: string
  capacity: number
  startTime: string
  endTime: string
  date: Date
  available: boolean
}

interface VirtualizedDayColumnProps {
  daySlots: TimeSlot[]
  height: number;
}

// Item renderer for react-window
const ItemRenderer = memo(({ 
  index, 
  style, 
  data 
}: { 
  index: number
  style: React.CSSProperties
  data: TimeSlot[]
}) => {
  const slot = data[index]
  if (!slot) return null
  
  return (
    <div style={style} className="flex justify-center">
      <TimeSlotButton slot={slot} />
    </div>
  )
})
ItemRenderer.displayName = 'ItemRenderer'

export const VirtualizedDayColumn = memo(({ 
  daySlots,
  height,
}: VirtualizedDayColumnProps) => {
  const listRef = useRef<List>(null)
  
  // Calculate item size based on TimeSlotButton height + spacing
  const ITEM_SIZE = 58 // 48px button height + 10px spacing
  
  // Force re-render when data changes
  const key = useMemo(() => daySlots.map(slot => `${slot.id}-${slot.available}`).join(','), [daySlots])
  
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
        key={key}
        ref={listRef}
        height={height}
        itemCount={daySlots.length}
        itemSize={ITEM_SIZE}
        itemData={daySlots}
        width="100%"
        className="scrollbar-hide"
      >
        {ItemRenderer}
      </List>
    </div>
  )
})
VirtualizedDayColumn.displayName = 'VirtualizedDayColumn' 