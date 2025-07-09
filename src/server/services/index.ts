import { PrismaClient } from '@prisma/client';
import { BookingService } from './booking.service';
import { RoomService } from './room.service';
import { TimeSlotService } from './timeSlot.service';
import { BookingRepository } from '../repositories/booking.repository';
import { RoomRepository } from '../repositories/room.repository';
import { TimeSlotRepository } from '../repositories/timeSlot.repository';

// Single instance of Prisma Client
const prisma = new PrismaClient();

// Initialize repositories
const bookingRepository = new BookingRepository(prisma);
const roomRepository = new RoomRepository(prisma);
const timeSlotRepository = new TimeSlotRepository(prisma);

// Initialize services with dependencies
export const bookingService = new BookingService(bookingRepository, roomRepository, timeSlotRepository);
export const roomService = new RoomService(roomRepository);
export const timeSlotService = new TimeSlotService(timeSlotRepository, roomRepository);
