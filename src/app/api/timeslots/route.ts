import { NextRequest, NextResponse } from "next/server";
import { timeSlotService } from "@/server/services";
import { startOfDay, endOfDay, differenceInDays } from "date-fns";
import { toUTCDate } from "@/lib/utils/dateHelpers";
import { isValid } from "date-fns";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const roomIdsParam = searchParams.get("roomIds");

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { success: false, error: "Missing required date parameters" },
        { status: 400 }
      );
    }
    
    const startDateRaw = toUTCDate(startDateParam);
    const endDateRaw = toUTCDate(endDateParam);

    if (!isValid(startDateRaw) || !isValid(endDateRaw)) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    const startDate = startOfDay(startDateRaw);
    const endDate = endOfDay(endDateRaw);

    // business rule: cannot request beyond maxAdvanceDays
    if (differenceInDays(endDate, new Date()) > config.booking.maxAdvanceDays) {
      return NextResponse.json(
        { success: false, error: `Date range exceeds ${config.booking.maxAdvanceDays} days limit` },
        { status: 400 }
      );
    }

    const roomIds = roomIdsParam ? roomIdsParam.split(',').map(Number) : [];

    const timeSlots = await timeSlotService.getAvailableTimeSlots({
        startDate,
        endDate,
        roomIds,
    });

    return NextResponse.json({
      success: true,
      data: timeSlots,
    });

  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch time slots" },
      { status: 500 }
    );
  }
} 