import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { addDays, startOfDay } from 'date-fns'
import { config } from '@/lib/config'
import type { Room } from '@/lib/types/room.types'

export interface TimeSlot {
  id: string
  roomName: string
  capacity: number
  startTime: string
  endTime: string
  date: Date
  available: boolean
}

export interface BookingState {
  // State
  selectedRooms: Room[]
  selectedDate: Date
  selectedSlot: string | null
  
  // Actions
  setSelectedRooms: (rooms: Room[]) => void
  setSelectedDate: (date: Date) => void
  setSelectedSlot: (slotId: string | null) => void
  navigateDateRange: (direction: 'prev' | 'next') => void
  resetBookingState: () => void
}

export const useBookingStore = create<BookingState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    selectedRooms: [],
    selectedDate: startOfDay(new Date()),
    selectedSlot: null,
    
    // Actions
    setSelectedRooms: (rooms) => {
      const current = get().selectedRooms;
      // Only update if actually changed
      if (JSON.stringify(current) !== JSON.stringify(rooms)) {
        set({ 
          selectedRooms: rooms,
          selectedSlot: null 
        })
      }
    },
    
    setSelectedDate: (date) => {
      const normalizedDate = startOfDay(date);
      const currentDate = get().selectedDate;
      
      // Only update if date actually changed
      if (normalizedDate.getTime() !== currentDate.getTime()) {
        set({ 
          selectedDate: normalizedDate,
          selectedSlot: null 
        })
      }
    },
    
    setSelectedSlot: (slotId) => {
      const current = get().selectedSlot;
      if (current !== slotId) {
        set({ selectedSlot: slotId })
      }
    },
    
    navigateDateRange: (direction) => {
      const { selectedDate } = get()
      const newDate = direction === 'next' 
        ? addDays(selectedDate, config.booking.navigationStep)
        : addDays(selectedDate, -config.booking.navigationStep)
      
      // Don't allow navigation to past dates (unless configured to allow)
      const today = startOfDay(new Date())
      if (direction === 'prev' && newDate < today && !config.booking.allowPastDates) {
        return // Don't update if it would go to past dates
      }
      
      // This will automatically clear selectedSlot via setSelectedDate
      get().setSelectedDate(newDate)
    },
    
    resetBookingState: () => {
      set({
        selectedRooms: [],
        selectedDate: startOfDay(new Date()),
        selectedSlot: null,
      })
    },
  }))
) 