import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/server/services/index';
import { CreateBookingSchema } from '@/server/validations/booking.schema';
import { handleError } from '@/lib/utils/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const roomIdParam = searchParams.get('roomId');
    let roomId: number | null = null;
    if (roomIdParam !== null) {
      roomId = Number(roomIdParam);
      if (isNaN(roomId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid roomId' },
          { status: 400 }
        );
      }
    }

    const bookings = await bookingService.getBookings({ date, roomId });

    return NextResponse.json({ 
      success: true,
      data: bookings 
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    // Parse roomId as number before validation
    if (typeof body.roomId === 'string') {
      body.roomId = Number(body.roomId);
    }
    if (isNaN(body.roomId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid roomId' },
        { status: 400 }
      );
    }
    // Parse timeSlotId as number before validation
    if (typeof body.timeSlotId === 'string') {
      body.timeSlotId = Number(body.timeSlotId);
    }
    if (typeof body.timeSlotId !== 'number' || isNaN(body.timeSlotId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid timeSlotId' },
        { status: 400 }
      );
    }
    const validatedData = CreateBookingSchema.parse(body);

    // 2. Call service layer (business logic)
    const booking = await bookingService.createBooking(validatedData);

    // 3. Return success response
    return NextResponse.json(
      { 
        success: true,
        data: booking,
        message: 'Created booking' 
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}