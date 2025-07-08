export interface Booking {
    id: number;
    roomId: number;
    timeSlotId: number;
    roomName: string;
    bookerName: string;
    userName: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    status: 'confirmed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
  }

export type CreateBookingData = Omit<Booking, 'id' | 'roomName' | 'createdAt' | 'updatedAt' | 'userName'>;

export interface BookingWithRoom {
  id: number;
  roomId: number;
  timeSlotId: number;
  userName: string;
  bookerName?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  room: {
    name: string;
  };
}