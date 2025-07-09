"use server";

import { z } from "zod";
import { bookingService } from "@/server/services";
import { BookingConflictError } from "@/lib/errors/booking.errors";

export interface FormState {
  message: string;
}

const BookSlotSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  slotId: z.string().min(1, { message: "A time slot must be selected." }),
});

export async function bookSlotAction(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    name: formData.get("name"),
    slotId: formData.get("slotId"),
  };

  const validatedFields = BookSlotSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessages = Object.values(errors).flat().join(" ");
    return { message: `Validation failed: ${errorMessages}` };
  }

  try {
    const { name, slotId } = validatedFields.data;

    // The slotId is a string: `${roomId}-${dateISOString}-${timeSlotId}`
    const [roomIdStr, dateISO, timeSlotIdStr] = slotId.split("-");
    const roomId = parseInt(roomIdStr, 10);
    const timeSlotId = parseInt(timeSlotIdStr.split('Z')[0], 10);
    const date = new Date(dateISO);

    if (isNaN(roomId) || isNaN(timeSlotId) || !date) {
        throw new Error("Invalid slot ID format.");
    }
    
    const tempTimeSlotData = await bookingService.getTimeSlotById(timeSlotId);
    if (!tempTimeSlotData) {
        throw new Error("Time slot not found.");
    }

    await bookingService.createBooking({
      bookerName: name,
      roomId,
      date: date.toISOString().split("T")[0], // YYYY-MM-DD
      timeSlotId,
      startTime: tempTimeSlotData.startTime,
      endTime: tempTimeSlotData.endTime,
    });

    return { message: "Bokning bekräftad!" };

  } catch (error) {
    if (error instanceof BookingConflictError) {
      return { message: error.message };
    }
    console.error("Booking failed:", error);
    return { message: "Ett fel uppstod vid bokningen. Försök igen." };
  }
} 