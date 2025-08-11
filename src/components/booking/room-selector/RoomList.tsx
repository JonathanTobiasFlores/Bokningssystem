import { Checkbox } from '@/components/ui/checkbox';
import type { Room } from '@/lib/types/room.types';

interface RoomListProps {
  rooms: Room[];
  selectedRooms: Room[];
  onRoomSelect: (room: Room) => void;
}

export function RoomList({ rooms, selectedRooms, onRoomSelect }: RoomListProps) {
  return (
    <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 hide-scrollbar">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="flex items-center justify-between"
        >
          <label
            htmlFor={`room-${room.id}`}
            className="font-normal text-base leading-[1.2] tracking-[-0.01em] text-black cursor-pointer"
          >
            {room.name} ({room.capacity} personer)
          </label>
          <Checkbox
            id={`room-${room.id}`}
            checked={selectedRooms.some((r) => r.id === room.id)}
            onCheckedChange={() => onRoomSelect(room)}
          />
        </div>
      ))}
    </div>
  );
}