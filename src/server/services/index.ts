import { PrismaClient } from '@prisma/client';
import { BookingService } from './booking.service';
import { RoomService } from './room.service';
import { BookingRepository } from '../repositories/booking.repository';
import { RoomRepository } from '../repositories/room.repository';

// Single instance of Prisma Client
const prisma = new PrismaClient();

// Initialize repositories
const bookingRepository = new BookingRepository(prisma);
const roomRepository = new RoomRepository(prisma);

// Initialize services with dependencies
export const bookingService = new BookingService(bookingRepository, roomRepository);
export const roomService = new RoomService(roomRepository);
