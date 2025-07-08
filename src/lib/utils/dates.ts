import { format, addDays } from 'date-fns';
import { sv } from 'date-fns/locale';

/**
 * Generate time slots for the booking system
 * 
 */
export function generateTimeSlots() {
    const slots = [];
    const hours = [8, 10, 11, 13, 14, 16];
    
    for (const hour of hours) {
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push({ start, end });
    }
    
    return slots;
  }
  
  /**
   * Format date for display (Swedish format)
   */
  export function formatDate(date: Date | string): string {
    return format(new Date(date), 'd MMM', { locale: sv });
  }
  
  /**
   * Get date range for the booking calendar
   */
  export function getDateRange(startDate: Date, days: number = 3): Date[] {
    return Array.from({ length: days }, (_, i) => addDays(startDate, i));
  }
  