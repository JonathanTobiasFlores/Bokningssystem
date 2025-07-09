import { PrismaClient } from '@prisma/client';
import { Booking, BookingWithRoom, CreateBookingData } from '@/lib/types/booking.types';
import { toUTCDate, toDBDateString } from '@/lib/utils/dateHelpers';

type PrismaTransactionalClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class BookingRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(filters: { date?: string | null; roomId?: number | null }): Promise<Booking[]> {
    const where: Record<string, unknown> = {};
    
    if (filters.date) {
      where.date = toUTCDate(filters.date);
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

  async create(
    data: CreateBookingData,
    tx?: PrismaTransactionalClient
  ): Promise<Booking> {
    const prismaClient = tx || this.prisma;
    const {
      roomId,
      bookerName,
      date,
      startTime,
      endTime,
      status,
      timeSlotId
    } = data;

    if (typeof timeSlotId !== 'number' || isNaN(timeSlotId)) {
      throw new Error('Invalid or missing timeSlotId');
    }

    const booking = await prismaClient.booking.create({
      data: {
        roomId,
        userName: bookerName,
        date: toUTCDate(date),
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
    tx?: PrismaTransactionalClient
  ): Promise<boolean> {
    const prismaClient = tx || this.prisma;
    const count = await prismaClient.booking.count({
      where: {
        roomId,
        date: toUTCDate(date),
        startTime: startTime,
        status: 'confirmed',
      },
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
      date: toDBDateString(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status as 'confirmed' | 'cancelled',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
}