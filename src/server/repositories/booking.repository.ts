import { PrismaClient } from '@prisma/client';
import { Booking, BookingWithRoom, CreateBookingData } from '@/lib/types/booking.types';

export class BookingRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(filters: { date?: string | null; roomId?: number | null }): Promise<Booking[]> {
    const where: Record<string, unknown> = {};
    
    if (filters.date) {
      where.date = new Date(filters.date);
    }
    
    if (filters.roomId) {
      where.roomId = filters.roomId;
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        room: true
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return bookings.map(this.mapToBooking);
  }

  async findById(id: number): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { room: true }
    });

    return booking ? this.mapToBooking(booking) : null;
  }

  async create(data: CreateBookingData): Promise<Booking> {
    const {
      roomId,
      bookerName,
      date,
      startTime,
      endTime,
      status,
      timeSlotId
    } = data;

    // Defensive: ensure timeSlotId is present and valid
    if (typeof timeSlotId !== 'number' || isNaN(timeSlotId)) {
      throw new Error('Invalid or missing timeSlotId');
    }

    const booking = await this.prisma.booking.create({
      data: {
        roomId,
        userName: bookerName,
        date: new Date(date),
        startTime,
        endTime,
        status,
        timeSlotId
      },
      include: { room: true }
    });

    return this.mapToBooking(booking);
  }

  async update(id: number, data: Partial<Booking>): Promise<Booking> {
    const booking = await this.prisma.booking.update({
      where: { id },
      data,
      include: { room: true }
    });

    return this.mapToBooking(booking);
  }

  async hasTimeConflict(
    roomId: number, 
    date: string, 
    startTime: string, 
    endTime: string
  ): Promise<boolean> {
    const count = await this.prisma.booking.count({
      where: {
        roomId,
        date: new Date(date),
        status: 'confirmed',
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    });

    return count > 0;
  }

  private mapToBooking(data: BookingWithRoom): Booking {
    return {
      id: data.id,
      roomId: data.roomId,
      timeSlotId: data.timeSlotId,
      roomName: data.room.name,
      bookerName: data.userName,
      userName: data.userName,
      date: data.date.toISOString().split('T')[0],
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status as 'confirmed' | 'cancelled',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
}