import { PrismaClient } from "@prisma/client";

export class TimeSlotRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllTimeSlots() {
    return this.prisma.timeSlot.findMany({
        orderBy: { startTime: 'asc' }
    });
  }

  async getBookingsForDateRange(startDate: Date, endDate: Date, roomIds: number[]) {
    return this.prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        roomId: {
          in: roomIds.length > 0 ? roomIds : undefined,
        },
        status: 'confirmed',
      },
      select: {
        date: true,
        timeSlotId: true,
        roomId: true,
      }
    });
  }

  async findById(id: number) {
    return this.prisma.timeSlot.findUnique({ where: { id } });
  }
} 