"use client";

import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/store/booking";
import { bookSlotAction, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SmileIcon } from "lucide-react";

export default function ConfirmPage() {
  const router = useRouter();
  const selectedSlot = useBookingStore((state) => state.selectedSlot);
  const resetBookingState = useBookingStore((state) => state.resetBookingState);
  const [name, setName] = useState("");

  const initialState: FormState = {
    message: "",
  };

  const [state, formAction, isPending] = React.useActionState(
    bookSlotAction,
    initialState
  );

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!selectedSlot) {
      redirect("/");
    }
  }, [selectedSlot]);

  React.useEffect(() => {
    if (state.message === "Bokning bekräftad!") {
      setIsDialogOpen(true);
    }
  }, [state.message]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetBookingState();
    router.push("/");
  };

  if (!selectedSlot) {
    return null;
  }

  const isFormValid = name.trim() !== "";

  return (
    <>
      <div className="bg-[#ececec] flex flex-row justify-center w-full min-h-screen">
        <div className="bg-[#ececec] w-[393px] h-[852px] relative flex flex-col">
          <main className="flex-1 px-6 pt-[79px] pb-6 flex flex-col">
            <div className="absolute w-[345px] top-[79px] left-6 font-normal text-black text-[40px] tracking-[-1.20px] leading-10 font-['Roboto',_sans-serif]">
              Vem bokar?
            </div>

            <form action={formAction} className="mb-auto mt-[90px]">
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-[45px] text-lg text-[#000000] border-[#bdbdbd] rounded-lg"
                  placeholder="Skriv ditt fullständiga namn här"
                  required
                />
              </div>

              {state?.message && state.message !== "Bokning bekräftad!" && (
                <p className="text-sm text-red-500 mt-4">{state.message}</p>
              )}

              <div className="absolute w-[345px] h-12 left-1/2 -translate-x-1/2 bottom-[53px]">
                <Button
                  type="submit"
                  disabled={isPending || !isFormValid}
                  variant="cta"
                  size="xl"
                  className="w-full h-full bg-[#1d1d1d] rounded-2xl text-white text-base hover:bg-[#1d1d1d]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Bokar..." : "Boka"}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="w-60 h-[137px] bg-[#ececec] rounded-2xl border-none p-0">
          <div className="flex flex-col items-center justify-center h-full">
            <DialogHeader>
              <DialogTitle className="sr-only">Bekräftelse</DialogTitle>
              <DialogDescription className="font-['Roboto',Helvetica] font-normal text-black text-base text-center tracking-[-0.16px] leading-[19.2px]">
                Ditt rum är bokat!
              </DialogDescription>
            </DialogHeader>
            <SmileIcon className="w-6 h-6 mt-4" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 