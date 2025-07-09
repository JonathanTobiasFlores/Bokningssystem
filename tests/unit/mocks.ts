import { vi } from 'vitest';

export const makePrisma = () => ({
  $transaction: vi.fn().mockImplementation(async (callback) => callback(this)),
});

export const makeBookingRepo = (overrides: Partial<any> = {}) => ({
  findMany: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  hasTimeConflict: vi.fn().mockResolvedValue(false),
  create: vi.fn().mockImplementation((data: any) => ({ id: 1, ...data })),
  update: vi.fn(),
  ...overrides,
});

export const makeRoomRepo = (overrides: Partial<any> = {}) => ({
  findById: vi.fn().mockResolvedValue({ id: 1, name: 'Room', capacity: 4 }),
  ...overrides,
});

export const makeTimeSlotRepo = (overrides: Partial<any> = {}) => ({
  findById: vi.fn().mockResolvedValue({ id: 1, startTime: '08:00', endTime: '09:00' }),
  ...overrides,
}); 