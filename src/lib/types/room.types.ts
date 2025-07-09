export interface Room {
  id: number;
  name: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface RoomWithBookings extends Room {
  bookedSlots: string[];
}