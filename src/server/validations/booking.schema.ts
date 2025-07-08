import { z } from 'zod';

export const CreateBookingSchema = z.object({
  roomId: z.number(),
  bookerName: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/)
}).refine((data) => {
  // Ensure end time is after start time
  return data.endTime > data.startTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

export type CreateBookingDto = z.infer<typeof CreateBookingSchema>;