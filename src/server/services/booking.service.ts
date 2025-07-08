import { BookingRepository } from '@/server/repositories/booking.repository';
import { RoomRepository } from '@/server/repositories/room.repository';
import { CreateBookingDto } from '@/server/validations/booking.schema';
import { 
  BookingConflictError, 
  RoomNotFoundError 
} from '@/lib/errors/booking.errors';
import { Booking } from '@/lib/types/booking.types';

export class BookingService {
  constructor(
    private bookingRepo: BookingRepository,
    private roomRepo: RoomRepository
  ) {}

  async getBookings(filters: { date?: string | null; roomId?: number | null }) {
    return this.bookingRepo.findMany(filters);
  }

  async createBooking(data: CreateBookingDto): Promise<Booking> {
    // 1. Verify room exists
    const room = await this.roomRepo.findById(data.roomId);
    if (!room) {
      throw new RoomNotFoundError(data.roomId);
    }

    // 2. Check for conflicts
    const hasConflict = await this.bookingRepo.hasTimeConflict(
      data.roomId,
      data.date,
      data.startTime,
      data.endTime
    );

    if (hasConflict) {
      throw new BookingConflictError(
        `Time slot ${data.startTime}-${data.endTime} is already booked`
      );
    }

    // 3. Create booking
    return this.bookingRepo.create({
      roomId: data.roomId,
      bookerName: data.bookerName,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'confirmed',
      timeSlotId: data.timeSlotId
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