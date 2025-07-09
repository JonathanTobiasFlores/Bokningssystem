import { NextRequest, NextResponse } from "next/server";
import { timeSlotService } from "@/server/services";
import { startOfDay, endOfDay, parseISO } from "date-fns";

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
    
    const startDate = startOfDay(parseISO(startDateParam));
    const endDate = endOfDay(parseISO(endDateParam));
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