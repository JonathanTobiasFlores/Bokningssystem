import { Prisma, PrismaClient, Room as PrismaRoom } from "@prisma/client";
import { Room, RoomWithBookings } from "@/lib/types/room.types";
import { toUTCDate } from "@/lib/utils/dateHelpers";

type PrismaRoomWithBookings = Prisma.RoomGetPayload<{
  include: { bookings: { select: { startTime: true; endTime: true } } };
}>;

export class RoomRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToRoom(room: any): Room {
    if (!room || typeof room.id !== 'number' || typeof room.name !== 'string' || typeof room.capacity !== 'number') {
        throw new Error("Invalid room object received for mapping.");
    }

    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      createdAt: room.createdAt ?? new Date(),
      updatedAt: room.updatedAt ?? new Date(),
      deletedAt: room.deletedAt ?? null,
    };
  }

  private mapToRoomWithBookings(
    room: PrismaRoomWithBookings
  ): RoomWithBookings {
    return {
      ...this.mapToRoom(room),
      bookedSlots: room.bookings.map((b) => `${b.startTime}-${b.endTime}`),
    };
  }

  async findAll(): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({ where: { deletedAt: null } });
    return rooms.map(this.mapToRoom);
  }

  async findAllWithDeleted(): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      orderBy: { name: "asc" },
    });
    return rooms.map(this.mapToRoom);
  }

  async findById(id: number): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: { id, deletedAt: null },
    });
    return room ? this.mapToRoom(room) : null;
  }

  async findByIds(ids: number[]): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      where: {
        ...(ids.length > 0 && { id: { in: ids } }),
        deletedAt: null,
      },
      orderBy: { name: "asc" },
    });
    return rooms.map(this.mapToRoom);
  }

  async create(
    data: Omit<Room, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Promise<Room> {
    const room = await this.prisma.room.create({ data });
    return this.mapToRoom(room);
  }

  async update(
    id: number,
    data: { name?: string; capacity?: number }
  ): Promise<Room> {
    const room = await this.prisma.room.update({ where: { id }, data });
    return this.mapToRoom(room);
  }

  async softDelete(id: number): Promise<Room | null> {
    const room = await this.prisma.room.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return this.mapToRoom(room);
  }

  async restore(id: number): Promise<Room> {
    const room = await this.prisma.room.update({
      where: { id },
      data: { deletedAt: null },
    });
    return this.mapToRoom(room);
  }

  async getRoomsWithAvailability(date: string): Promise<RoomWithBookings[]> {
    const targetDate = toUTCDate(date);
    const roomsWithBookings = await this.prisma.room.findMany({
      where: { deletedAt: null },
      include: {
        bookings: {
          where: { date: { equals: targetDate } },
          select: { startTime: true, endTime: true },
        },
      },
    });
    return roomsWithBookings.map(this.mapToRoomWithBookings);
  }
}