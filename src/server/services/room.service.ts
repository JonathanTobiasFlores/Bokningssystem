import { RoomRepository } from '@/server/repositories/room.repository';
import { generateTimeSlots } from '@/lib/utils/dates';
import { z } from 'zod';
import { RoomWithBookings } from '@/lib/types/room.types';

const RoomSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  capacity: z.number().min(1, "Capacity must be at least 1."),
});

const UpdateRoomSchema = RoomSchema.partial();

export class RoomService {
  constructor(private roomRepo: RoomRepository) {}

  async createRoom(data: { name: string; capacity: number }) {
    const validatedData = RoomSchema.parse(data);
    return this.roomRepo.create(validatedData);
  }

  async updateRoom(id: number, data: { name?: string; capacity?: number }) {
    const validatedData = UpdateRoomSchema.parse(data);
    if (Object.keys(validatedData).length === 0) {
      throw new Error("No valid fields provided for update.");
    }
    return this.roomRepo.update(id, validatedData);
  }

  async deleteRoom(id: number) {
    return this.roomRepo.softDelete(id);
  }

  async restoreRoom(id: number) {
    return this.roomRepo.restore(id);
  }

  async getAllRooms() {
    return this.roomRepo.findAll();
  }

  async getAllRoomsWithDeleted() {
    return this.roomRepo.findAllWithDeleted();
  }

  async getRoomsWithAvailability(date: string) {
    const rooms = await this.roomRepo.getRoomsWithAvailability(date);
    const allSlots = generateTimeSlots();
    
    // Add availability info for each room
    return rooms.map((room: RoomWithBookings) => ({
      ...room,
      timeSlots: allSlots.map(slot => ({
        ...slot,
        available: !room.bookedSlots.includes(`${slot.start}-${slot.end}`)
      }))
    }));
  }

  async getRoomById(id: number) {
    return this.roomRepo.findById(id);
  }
}