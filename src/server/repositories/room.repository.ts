import { PrismaClient } from '@prisma/client';
import { Room, RoomWithBookings } from '@/lib/types/room.types';

export class RoomRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Room[]> {
    try {
      const rooms = await this.prisma.room.findMany({
        orderBy: { capacity: 'asc' }
      });
      console.log('DEBUG: rooms from Prisma:', rooms);
      return rooms.map(this.mapToRoom);
    } catch (error) {
      console.error('DEBUG: Error in findAll:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
    return room ? this.mapToRoom(room) : null;
  }

  async findWithAvailability(date: string): Promise<(Room & { bookedSlots: string[] })[]> {
    const rooms = await this.prisma.room.findMany({
      include: {
        bookings: {
          where: {
            date: new Date(date),
            status: 'confirmed'
          },
          select: {
            startTime: true,
            endTime: true
          }
        }
      },
      orderBy: { capacity: 'asc' }
    });

    return rooms.map((room: RoomWithBookings) => ({
      ...this.mapToRoom(room),
      bookedSlots: room.bookings.map((b: { startTime: string; endTime: string }) => `${b.startTime}-${b.endTime}`)
    }));
  }

  private mapToRoom(data: Pick<RoomWithBookings, 'id' | 'name' | 'capacity' | 'createdAt' | 'updatedAt'>): Room {
    return {
      id: data.id,
      name: data.name,
      capacity: data.capacity,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
}