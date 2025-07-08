"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useBookingStore } from "@/lib/store/booking";
import { bookSlotAction, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      variant="cta"
      size="xl"
    >
      {isPending ? "Bokar..." : "Boka"}
    </Button>
  );
}

export default function ConfirmPage() {
  const selectedSlot = useBookingStore((state) => state.selectedSlot);

  const initialState: FormState = {
    message: "",
  };

  const [state, formAction, isPending] = React.useActionState(
    bookSlotAction,
    initialState
  );

  React.useEffect(() => {
    if (!selectedSlot) {
      redirect("/");
    }
  }, [selectedSlot]);

  if (!selectedSlot) {
    return null;
  }

  return (
    <div className="bg-[#ececec] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#ececec] w-[393px] h-[852px] relative flex flex-col">
        <main className="flex-1 px-6 pt-[79px] pb-6 flex flex-col">
          <h1 className="font-normal text-[40px] text-black tracking-[-1.20px] leading-10 mb-[40px]">
            Vem bokar?
          </h1>

          <form action={formAction} className="mb-auto">
            <input type="hidden" name="slotId" value={selectedSlot} />

            <div className="mb-auto">
              <Label
                htmlFor="name"
                className="block font-medium text-xl text-[#212121] tracking-[-0.20px] mb-2.5"
              >
                Förnamn och efternamn
              </Label>
              <Input
                id="name"
                name="name"
                className="h-[45px] text-lg text-[#000000] border-[#bdbdbd] rounded-lg"
                placeholder="Skriv ditt fullständiga namn här"
                required
              />
            </div>

            {state?.message && (
              <p className="text-sm text-red-500 mt-4">{state.message}</p>
            )}

            <div className="absolute w-[345px] h-12 left-1/2 -translate-x-1/2 bottom-[53px]">
              <SubmitButton isPending={isPending} />
            </div>
          </form>
        </main>
      </div>
    </div>
  );
} 