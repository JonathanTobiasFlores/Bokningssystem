"use client";

import { useState } from "react";
import { Room } from "@/lib/types/room.types";
import {
  updateRoomAction,
  deleteRoomAction,
  restoreRoomAction,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RoomItemProps {
  room: Room;
}

export function RoomItem({ room }: RoomItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (formData: FormData) => {
    await updateRoomAction(room.id, formData);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg transition-colors bg-[#ECECEC] border border-[#BDBDBD]",
        room.deletedAt && "opacity-60"
      )}
    >
      {isEditing ? (
        <form action={handleUpdate} className="flex-grow space-y-2">
          <div>
            <Label htmlFor={`name-${room.id}`} className="sr-only">
              Room Name
            </Label>
            <Input
              id={`name-${room.id}`}
              name="name"
              type="text"
              defaultValue={room.name}
              className="w-full h-[45px] text-lg text-[#000000] border-[#BDBDBD] rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor={`capacity-${room.id}`} className="sr-only">
              Capacity
            </Label>
            <Input
              id={`capacity-${room.id}`}
              name="capacity"
              type="number"
              defaultValue={room.capacity}
              className="w-full h-[45px] text-lg text-[#000000] border-[#BDBDBD] rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="border border-[#BDBDBD]">
              Spara ändringar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Avbryt
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div>
            <p className="font-semibold text-lg text-[#212121]">{room.name}</p>
            <p className="text-sm text-gray-600">
              Kapacitet: {room.capacity}
              {room.deletedAt && (
                <span className="ml-2 text-red-600 font-bold">(Raderad)</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {!room.deletedAt && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border border-[#BDBDBD]"
              >
                Redigera
              </Button>
            )}
            {room.deletedAt ? (
              <form
                action={async () => {
                  await restoreRoomAction(room.id);
                }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  type="submit"
                  className="border border-[#BDBDBD]"
                >
                  Återställ
                </Button>
              </form>
            ) : (
              <form
                action={async () => {
                  await deleteRoomAction(room.id);
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  className="text-red-600 hover:text-red-700 hover:bg-red-100 border border-[#BDBDBD]"
                >
                  Radera
                </Button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
} 