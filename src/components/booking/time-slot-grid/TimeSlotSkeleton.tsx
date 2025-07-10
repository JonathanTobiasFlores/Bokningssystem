import { Skeleton } from "@/components/ui/skeleton"
import { format, addDays } from "date-fns"
import { sv } from "date-fns/locale"

interface TimeSlotGridSkeletonProps {
  selectedDate: Date
}

export function TimeSlotGridSkeleton({ selectedDate }: TimeSlotGridSkeletonProps) {
  const dates = [
    selectedDate,
    addDays(selectedDate, 1),
    addDays(selectedDate, 2)
  ]

  return (
    <div className="border border-[#BDBDBD] rounded-lg">
      {/* Date headers */}
      <div className="grid grid-cols-3 border-b border-[#BDBDBD]">
        {dates.map((date, index) => (
          <div 
            key={index}
            className="py-3 text-center font-medium text-base border-r border-[#BDBDBD] last:border-r-0"
          >
            {format(date, 'd MMM', { locale: sv })}
          </div>
        ))}
      </div>
      
      {/* Time slots skeleton */}
      <div className="p-2">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, dayIndex) => (
            <div key={dayIndex} className="space-y-2">
              {Array.from({ length: 6 }).map((_, slotIndex) => (
                <Skeleton 
                  key={slotIndex} 
                  className="h-12 w-full rounded"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 