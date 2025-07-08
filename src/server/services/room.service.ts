import { RoomRepository } from '@/server/repositories/room.repository';
import { generateTimeSlots } from '@/lib/utils/dates';

export class RoomService {
  constructor(private roomRepo: RoomRepository) {}

  async getAllRooms() {
    return this.roomRepo.findAll();
  }

  async getRoomsWithAvailability(date: string) {
    const rooms = await this.roomRepo.findWithAvailability(date);
    const allSlots = generateTimeSlots();
    
    // Add availability info for each room
    return rooms.map(room => ({
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