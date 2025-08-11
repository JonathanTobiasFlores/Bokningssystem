// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { BookingService } from '@/server/services/booking.service';
import {
  BookingConflictError,
  RoomNotFoundError,
  BookingInPastError,
  BookingDateOutOfRangeError,
} from '@/lib/errors/booking.errors';
import { makeBookingRepo, makeRoomRepo, makeTimeSlotRepo, makePrisma } from './mocks';

const baseBooking = {
  roomId: 1,
  userName: 'Tester',
  date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], // Tomorrow
  startTime: '08:00',
  endTime: '09:00',
  timeSlotId: 1,
};

describe('BookingService', () => {
  it('throws RoomNotFoundError when room does not exist', async () => {
    const service = new BookingService(
      makePrisma(),
      makeBookingRepo(),
      makeRoomRepo({ findById: vi.fn().mockResolvedValue(null) }),
      makeTimeSlotRepo()
    );
    await expect(service.createBooking(baseBooking)).rejects.toBeInstanceOf(RoomNotFoundError);
  });

  it('throws BookingConflictError on duplicate slot', async () => {
    const service = new BookingService(
      makePrisma(),
      makeBookingRepo({ hasTimeConflict: vi.fn().mockResolvedValue(true) }),
      makeRoomRepo(),
      makeTimeSlotRepo()
    );
    await expect(service.createBooking(baseBooking)).rejects.toBeInstanceOf(BookingConflictError);
  });

  it('throws BookingInPastError when booking date is in the past', async () => {
    const service = new BookingService(makePrisma(), makeBookingRepo(), makeRoomRepo(), makeTimeSlotRepo());
    const pastBooking = { ...baseBooking, date: '2020-01-01' };
    await expect(service.createBooking(pastBooking)).rejects.toBeInstanceOf(BookingInPastError);
  });

  it('throws BookingDateOutOfRangeError when booking date is too far in the future', async () => {
    const service = new BookingService(makePrisma(), makeBookingRepo(), makeRoomRepo(), makeTimeSlotRepo());
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 100); // Well beyond the typical 90-day limit
    const futureBooking = { ...baseBooking, date: futureDate.toISOString().split('T')[0] };
    await expect(service.createBooking(futureBooking)).rejects.toBeInstanceOf(BookingDateOutOfRangeError);
  });

  it('creates booking successfully when no conflict', async () => {
    const fakePrisma = makePrisma();
    const fakeBookingRepo = makeBookingRepo();
    const service = new BookingService(fakePrisma, fakeBookingRepo, makeRoomRepo(), makeTimeSlotRepo());

    const result = await service.createBooking(baseBooking);

    expect(result.id).toBe(1);
    expect(fakeBookingRepo.create).toHaveBeenCalledOnce();
    expect(fakePrisma.$transaction).toHaveBeenCalledOnce();
  });
}); 