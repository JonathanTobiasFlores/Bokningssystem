import { roomService } from "@/server/services";
import { Room } from "@/lib/types/room.types";
import { RoomItem } from "./RoomItem";
import { AddRoomForm } from "./AddRoomForm";

export default async function AdminRoomsPage() {
  const rooms: Room[] = await roomService.getAllRoomsWithDeleted();

  return (
    <main className="flex justify-center bg-[#ECECEC]">
      <div className="w-[393px] h-[852px] relative bg-[#ECECEC] overflow-hidden">
        <div className="absolute w-[345px] top-[79px] left-6">
          <h1 className="w-full font-normal text-black text-[40px] tracking-[-1.20px] leading-10 font-['Roboto',_sans-serif]">
            Rumshantering
          </h1>
        </div>

        <div className="absolute w-[345px] top-[160px] left-6">
          <AddRoomForm />
        </div>

        <div className="absolute w-[345px] top-[430px] left-6 right-6 bottom-0 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex-shrink-0">
            Befintliga rum
          </h2>
          <div className="flex-grow space-y-4 overflow-y-auto hide-scrollbar pr-2">
            {rooms.map((room) => (
              <RoomItem key={room.id} room={room} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 