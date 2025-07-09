"use server";

import { z } from "zod";
import { bookingService } from "@/server/services";
import { BookingConflictError } from "@/lib/errors/booking.errors";
import { toUTCDate, toDBDateString } from "@/lib/utils/dateHelpers";

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
  
    // Debug log to see the format
    console.log("SlotId format:", slotId);
  
    // The slotId format is: roomId-dateISOString-timeSlotId
    // Example: "1-2025-01-09T00:00:00.000Z-3"
    
    // Find the first hyphen (after roomId)
    const firstHyphenIndex = slotId.indexOf('-');
    const roomId = parseInt(slotId.substring(0, firstHyphenIndex), 10);
    
    // Find the last hyphen (before timeSlotId)
    const lastHyphenIndex = slotId.lastIndexOf('-');
    const timeSlotId = parseInt(slotId.substring(lastHyphenIndex + 1), 10);
    
    // Everything between first and last hyphen is the date (ISO string)
    const dateISO = slotId.substring(firstHyphenIndex + 1, lastHyphenIndex);
    const date = toUTCDate(dateISO);
  
    console.log("Parsed values:", { roomId, timeSlotId, dateISO, date });
  
    if (isNaN(roomId) || isNaN(timeSlotId) || !date || isNaN(date.getTime())) {
      console.error("Parsing failed:", { roomId, timeSlotId, date, slotId });
      throw new Error("Invalid slot ID format.");
    }
    
    const tempTimeSlotData = await bookingService.getTimeSlotById(timeSlotId);
    if (!tempTimeSlotData) {
      throw new Error("Time slot not found.");
    }
  
    await bookingService.createBooking({
      bookerName: name,
      roomId,
      date: toDBDateString(date),
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