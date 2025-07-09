import { ApiError } from './api.errors';

export class BookingConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, 'BOOKING_CONFLICT');
  }
}

export class RoomNotFoundError extends ApiError {
  constructor(roomId: number) {
    super(`Room ${roomId} not found`, 404, 'ROOM_NOT_FOUND');
  }
}

export class BookingDateOutOfRangeError extends ApiError {
  constructor(maxDays: number) {
    super(`Bookings can only be made up to ${maxDays} days in advance`, 400, 'DATE_OUT_OF_RANGE');
  }
}

export class BookingInPastError extends ApiError {
  constructor() {
    super('Cannot book a time slot that is in the past', 400, 'BOOKING_IN_PAST');
  }
}