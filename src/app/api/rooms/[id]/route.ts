import { NextRequest, NextResponse } from 'next/server';
import { roomService } from '@/server/services';
import { handleError } from '@/lib/utils/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid room ID' },
        { status: 400 }
      );
    }
    const room = await roomService.getRoomById(numericId);
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    return handleError(error);
  }
} 