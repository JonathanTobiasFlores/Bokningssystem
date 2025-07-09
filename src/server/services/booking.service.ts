import { BookingRepository } from '@/server/repositories/booking.repository';
import { RoomRepository } from '@/server/repositories/room.repository';
import { TimeSlotRepository } from '../repositories/timeSlot.repository';
import { CreateBookingDto } from '@/server/validations/booking.schema';
import { 
  BookingConflictError, 
  RoomNotFoundError,
  BookingDateOutOfRangeError,
  BookingInPastError
} from '@/lib/errors/booking.errors';
import { Booking } from '@/lib/types/booking.types';
import { differenceInDays, startOfDay, isToday, parse } from 'date-fns';
import { toUTCDate, getZonedTime } from '@/lib/utils/dateHelpers';
import { config } from '@/lib/config';
import { PrismaClient } from '@prisma/client';

export class BookingService {
  constructor(
    private prisma: PrismaClient,
    private bookingRepo: BookingRepository,
    private roomRepo: RoomRepository,
    private timeSlotRepo: TimeSlotRepository
  ) {}

  async getBookings(filters: { date?: string | null; roomId?: number | null }) {
    return this.bookingRepo.findMany(filters);
  }

  async getTimeSlotById(id: number) {
    return this.timeSlotRepo.findById(id);
  }

  async createBooking(data: CreateBookingDto): Promise<Booking> {
    // 1. Verify room exists
    const room = await this.roomRepo.findById(data.roomId);
    if (!room) {
      throw new RoomNotFoundError(data.roomId);
    }

    // 2. Business rule validations
    const maxDays = config.booking.maxAdvanceDays;
    const bookingDate = startOfDay(toUTCDate(data.date));
    const today = startOfDay(toUTCDate(new Date()));
    if (differenceInDays(bookingDate, today) > maxDays) {
      throw new BookingDateOutOfRangeError(maxDays);
    }
    if (bookingDate < today) {
      throw new BookingInPastError();
    }

    if (isToday(bookingDate)) {
      const now = getZonedTime(new Date());
      const slotStartTime = parse(data.startTime, 'HH:mm', new Date());
      const slotDateTime = new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(),
        bookingDate.getDate(),
        slotStartTime.getHours(),
        slotStartTime.getMinutes()
      );

      if (now > slotDateTime) {
        throw new BookingInPastError();
      }
    }

    // 3. Transactional booking creation
    return this.prisma.$transaction(async (tx) => {
      // Proactively check for conflict for immediate feedback
      const hasConflict = await this.bookingRepo.hasTimeConflict(
        data.roomId,
        data.date,
        data.startTime,
        tx
      );
      if (hasConflict) {
        throw new BookingConflictError(
          `Time slot ${data.startTime}-${data.endTime} is already booked`
        );
      }
      
      try {
        return await this.bookingRepo.create(
          {
            roomId: data.roomId,
            bookerName: data.bookerName,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            status: 'confirmed',
            timeSlotId: data.timeSlotId,
          },
          tx
        );
      } catch (error: any) {
        // Handle unique constraint violation for race conditions
        if (error.code === 'P2002') {
          throw new BookingConflictError(
            `Time slot ${data.startTime}-${data.endTime} is already booked`
          );
        }
        throw error;
      }
    });
  }

  async cancelBooking(id: number): Promise<Booking> {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    return this.bookingRepo.update(id, { status: 'cancelled' });
  }
}