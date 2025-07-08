import { NextRequest, NextResponse } from 'next/server';
import { roomService } from '@/server/services';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    
    if (date) {
      // Get rooms with availability for specific date
      const rooms = await roomService.getRoomsWithAvailability(date);
      return NextResponse.json({
        success: true,
        data: rooms
      });
    }
    
    // Get all rooms
    const rooms = await roomService.getAllRooms();
    return NextResponse.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}