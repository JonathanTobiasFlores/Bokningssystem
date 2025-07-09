"use server";

import { roomService } from "@/server/services";
import { revalidatePath } from "next/cache";

export async function createRoomAction(formData: FormData) {
  const name = formData.get("name") as string;
  const capacity = Number(formData.get("capacity"));

  try {
    await roomService.createRoom({ name, capacity });
    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }
}

export async function updateRoomAction(roomId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const capacityValue = formData.get("capacity");
  const capacity = capacityValue ? Number(capacityValue) : undefined;

  const updateData: { name?: string; capacity?: number } = {};
  if (name) updateData.name = name;
  if (capacity !== undefined) updateData.capacity = capacity;

  try {
    await roomService.updateRoom(roomId, updateData);
    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }
}

export async function deleteRoomAction(roomId: number) {
  try {
    await roomService.deleteRoom(roomId);
    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }
}

export async function restoreRoomAction(roomId: number) {
  try {
    await roomService.restoreRoom(roomId);
    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }
} 