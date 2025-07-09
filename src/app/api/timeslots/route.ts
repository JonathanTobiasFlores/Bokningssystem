import { NextRequest, NextResponse } from "next/server";
import { timeSlotService } from "@/server/services";
import { startOfDay, endOfDay, differenceInDays } from "date-fns";
import { toUTCDate } from "@/lib/utils/dateHelpers";
import { isValid } from "date-fns";
import { config } from "@/lib/config";
import { z } from 'zod';
import { handleError } from '@/lib/utils/api-helpers';

// Define the schema for query parameters
const timeSlotsQuerySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  roomIds: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const query = Object.fromEntries(request.nextUrl.searchParams.entries());
    const validation = timeSlotsQuerySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: validation.error.format() },
        { status: 400 }
      );
    }
    const { startDate: startDateString, endDate: endDateString, roomIds } = validation.data;

    const startDate = startOfDay(toUTCDate(startDateString));
    const endDate = endOfDay(toUTCDate(endDateString));

    if (!isValid(startDate) || !isValid(endDate)) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    // business rule: cannot request beyond maxAdvanceDays
    if (differenceInDays(endDate, new Date()) > config.booking.maxAdvanceDays) {
      return NextResponse.json(
        { success: false, error: `Date range exceeds ${config.booking.maxAdvanceDays} days limit` },
        { status: 400 }
      );
    }

    const roomIdsArray = roomIds ? roomIds.split(',').map(Number) : [];

    const timeSlots = await timeSlotService.getAvailableTimeSlots({
      startDate,
      endDate,
      roomIds: roomIdsArray,
    });

    return NextResponse.json({
      success: true,
      data: timeSlots,
    });
  } catch (error) {
    return handleError(error);
  }
} 