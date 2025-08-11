import { format, parseISO } from 'date-fns';
import { formatISO as dateFnsFormatISO } from 'date-fns';
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

// ISO string that preserves timezone information
export const toISOStringLocal = (date: Date): string => {
  return dateFnsFormatISO(date);
};

export const getZonedTime = (date: Date, timeZone = 'Europe/Stockholm') => {
  return utcToZonedTime(date, timeZone);
}; 