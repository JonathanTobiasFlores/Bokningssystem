export interface Room {
    id: number;
    name: string;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface RoomWithAvailability extends Room {
    bookedSlots: string[]; // Array of "HH:MM-HH:MM"
  }

export interface RoomWithBookings {
  id: number;
  name: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  bookings: {
    startTime: string;
    endTime: string;
  }[];
}