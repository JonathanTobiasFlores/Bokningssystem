// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { BookingService } from '@/server/services/booking.service';
import { BookingConflictError, RoomNotFoundError } from '@/lib/errors/booking.errors';
import { makeBookingRepo, makeRoomRepo, makeTimeSlotRepo } from './mocks';

const baseBooking = {
  roomId: 1,
  bookerName: 'Tester',
  date: '2025-01-01',
  startTime: '08:00',
  endTime: '09:00',
  timeSlotId: 1,
};

describe('BookingService', () => {
  it('throws RoomNotFoundError when room does not exist', async () => {
    const service = new BookingService(
      makeBookingRepo(),
      makeRoomRepo({ findById: async () => null }),
      makeTimeSlotRepo(),
    ) as any;
    await expect(service.createBooking(baseBooking)).rejects.toBeInstanceOf(RoomNotFoundError);
  });

  it('throws BookingConflictError on duplicate slot', async () => {
    const service = new BookingService(
      makeBookingRepo({ hasTimeConflict: async () => true }) as any,
      makeRoomRepo() as any,
      makeTimeSlotRepo() as any,
    ) as any;
    await expect(service.createBooking(baseBooking)).rejects.toBeInstanceOf(BookingConflictError);
  });

  it('creates booking successfully when no conflict', async () => {
    const fakeRepo = makeBookingRepo() as any;
    const service = new BookingService(
      fakeRepo,
      makeRoomRepo() as any,
      makeTimeSlotRepo() as any,
    ) as any;
    const result = await service.createBooking(baseBooking);
    expect(result.id).toBe(1);
    expect(fakeRepo.create).toHaveBeenCalledOnce();
  });
}); 