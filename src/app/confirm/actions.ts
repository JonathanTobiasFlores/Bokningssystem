"use server";

import { z } from "zod";

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
    // Return the validation errors
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessages = Object.values(errors).flat().join(" ");
    return { message: `Validation failed: ${errorMessages}` };
  }

  console.log("Booking successful!");
  console.log("Name:", validatedFields.data.name);
  console.log("Slot ID:", validatedFields.data.slotId);

  return { message: "Bokning bekräftad!" };
} 