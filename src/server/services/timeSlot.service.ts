import { TimeSlotRepository } from "../repositories/timeSlot.repository";
import { RoomRepository } from "../repositories/room.repository";
import { eachDayOfInterval, formatISO, startOfDay } from "date-fns";
import { toISOStringLocal } from "@/lib/utils/dateHelpers";
import type { TimeSlot as PrismaTimeSlot } from '@prisma/client';

interface GetAvailableTimeSlotsParams {
  startDate: Date;
  endDate: Date;
  roomIds: number[];
}

// This is the structure the frontend expects
export interface TimeSlot {
  id: string;
  roomName: string;
  roomId: number;
  capacity: number;
  startTime: string;
  endTime: string;
  date: Date;
  available: boolean;
}

export class TimeSlotService {
  constructor(
    private timeSlotRepo: TimeSlotRepository,
    private roomRepo: RoomRepository
  ) {}

  async getAvailableTimeSlots({
    startDate,
    endDate,
    roomIds,
  }: GetAvailableTimeSlotsParams): Promise<TimeSlot[]> {
    
    const [allPrismaSlots, allRooms, bookings] = await Promise.all([
      this.timeSlotRepo.getAllTimeSlots(),
      this.roomRepo.findByIds(roomIds),
      this.timeSlotRepo.getBookingsForDateRange(startDate, endDate, roomIds)
    ]);

    const bookingsSet = new Set(
        bookings.map(b => `${formatISO(b.date, { representation: 'date' })}-${b.timeSlotId}-${b.roomId}`)
    );

    const availableSlots: TimeSlot[] = [];
    const interval = { start: startDate, end: endDate };
    const dateRange = eachDayOfInterval(interval);

    for (const room of allRooms) {
        for (const date of dateRange) {
            for (const prismaSlot of allPrismaSlots) {
                const slotDate = startOfDay(date);
                const bookingId = `${formatISO(slotDate, { representation: 'date' })}-${prismaSlot.id}-${room.id}`;
                const isBooked = bookingsSet.has(bookingId);

                availableSlots.push({
                    id: `${room.id}-${toISOStringLocal(slotDate)}-${prismaSlot.id}`,
                    roomName: room.name,
                    roomId: room.id,
                    capacity: room.capacity,
                    startTime: prismaSlot.startTime,
                    endTime: prismaSlot.endTime,
                    date: slotDate,
                    available: !isBooked,
                });
            }
        }
    }
    
    return availableSlots;
  }
} 