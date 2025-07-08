import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/server/services/index';
import { CreateBookingSchema } from '@/server/validations/booking.schema';
import { ApiError } from '@/lib/errors/api.errors';
import { ZodError } from 'zod';

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

// Centralized error handling
function handleError(error: unknown): NextResponse {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: error.errors
      },
      { status: 400 }
    );
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  console.error('Unexpected error:', error);
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error'
    },
    { status: 500 }
  );
}