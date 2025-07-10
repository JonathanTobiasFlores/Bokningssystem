"use client";

import { useRef} from "react";
import { createRoomAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddRoomForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreateRoom = async (formData: FormData) => {
    const result = await createRoomAction(formData);
    if (result.success) {
      formRef.current?.reset();
    } else {
      console.error('Failed to create room:', result.error);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Lägg till nytt rum</h2>
      <form ref={formRef} action={handleCreateRoom} className="space-y-4">
        <div>
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-[#212121]"
          >
            Rumsnamn
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full h-[45px] text-lg text-[#000000] border-[#BDBDBD] rounded-lg"
            placeholder="t.ex., Stora konferensrummet"
          />
        </div>
        <div>
          <Label
            htmlFor="capacity"
            className="block text-sm font-medium text-[#212121]"
          >
            Kapacitet
          </Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            required
            className="mt-1 block w-full h-[45px] text-lg text-[#000000] border-[#BDBDBD] rounded-lg"
            placeholder="t.ex., 10"
          />
        </div>
        <Button
          type="submit"
          variant="cta"
          size="lg"
          className="w-full h-full bg-[#1d1d1d] rounded-2xl text-white text-base hover:bg-[#1d1d1d]/90"
        >
          Skapa rum
        </Button>
      </form>
    </>
  );
} 