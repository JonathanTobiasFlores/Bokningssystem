import { create } from 'zustand'
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
  userName: string
  
  // Actions
  setSelectedRooms: (rooms: Room[]) => void
  setSelectedDate: (date: Date) => void
  setSelectedSlot: (slotId: string | null) => void
  setUserName: (name: string) => void
  navigateDateRange: (direction: 'prev' | 'next') => void
  resetBookingState: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial state
  selectedRooms: [],
  selectedDate: startOfDay(new Date()),
  selectedSlot: null,
  userName: '',
  
  // Actions
  setSelectedRooms: (rooms) => {
    set({ 
      selectedRooms: rooms,
      // FIXED: Clear selected slot when rooms change since slot IDs include room ID
      selectedSlot: null 
    })
  },
  
  setSelectedDate: (date) => {
    set({ 
      selectedDate: startOfDay(date),
      // Clear selected slot when date changes since slot IDs include date
      selectedSlot: null 
    })
  },
  
  setSelectedSlot: (slotId) => {
    set({ selectedSlot: slotId })
  },
  
  setUserName: (name) => {
    set({ userName: name })
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
      userName: '',
    })
  },
})) 