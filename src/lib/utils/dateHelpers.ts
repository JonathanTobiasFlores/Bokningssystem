import { format, parseISO, isBefore, addMinutes } from 'date-fns';
import { formatISO as dateFnsFormatISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toZonedTime as utcToZonedTime, fromZonedTime as zonedTimeToUtc } from 'date-fns-tz';

// Always work with UTC in the database
export const toUTCDate = (date: Date | string): Date => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return zonedTimeToUtc(parsed, 'UTC');
};

// Convert UTC to user's timezone for display
export const fromUTCDate = (
  date: Date | string,
  timeZone = 'Europe/Stockholm'
): Date => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return utcToZonedTime(parsed, timeZone);
};

// Create a date string for the database (always UTC, YYYY-MM-DD)
export const toDBDateString = (date: Date | string): string => {
  return format(toUTCDate(date), 'yyyy-MM-dd');
};

// Parse slot datetime consistently (expects ISO date string and HH:mm startTime)
export const parseSlotDateTime = (date: string, time: string): Date => {
  return parseISO(`${date}T${time}:00.000Z`);
};

// Check if booking time has passed
export const isBookingInPast = (
  date: string,
  startTime: string,
  minNoticeMinutes = 15
): boolean => {
  const bookingTime = parseSlotDateTime(date, startTime);
  const minBookingTime = addMinutes(new Date(), minNoticeMinutes);
  return isBefore(bookingTime, minBookingTime);
};

// Format date consistently for display (e.g. 5 jan)
export const formatDisplayDate = (date: Date | string): string => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, 'd MMM', { locale: sv });
};

// ISO string that preserves timezone information
export const toISOStringLocal = (date: Date): string => {
  return dateFnsFormatISO(date);
};

export const getZonedTime = (date: Date, timeZone = 'Europe/Stockholm') => {
  return utcToZonedTime(date, timeZone);
} 