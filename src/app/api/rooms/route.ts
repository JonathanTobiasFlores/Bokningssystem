import { NextResponse } from 'next/server';
import { roomService } from '@/server/services';
import { handleError } from '@/lib/utils/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rooms = await roomService.getAllRooms();
    return NextResponse.json({ success: true, data: rooms });
  } catch (error) {
    return handleError(error);
  }
}