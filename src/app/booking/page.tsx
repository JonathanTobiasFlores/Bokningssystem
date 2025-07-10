"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RoomSelector } from "@/components/booking/room-selector/RoomSelector";
import { TimeSlotGrid } from "@/components/booking/time-slot-grid/TimeSlotGrid";
import { DateNavigator } from "@/components/booking/DateNavigator";
import { useBookingStore } from "@/lib/store/booking";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Memoize static components
const PageTitle = memo(() => (
  <div className="absolute w-[345px] top-[79px] left-6 font-normal text-black text-[40px] tracking-[-1.20px] leading-10 font-['Roboto',_sans-serif]">
    Välj en tid
  </div>
));
PageTitle.displayName = "PageTitle";

const RoomSelectorWrapper = memo(() => (
  <div className="absolute top-[165px] left-6">
    <RoomSelector />
  </div>
));
RoomSelectorWrapper.displayName = "RoomSelectorWrapper";

const DateNavigatorWrapper = memo(() => (
  <div className="absolute w-[345px] top-[250px] left-6">
    <DateNavigator />
  </div>
));
DateNavigatorWrapper.displayName = "DateNavigatorWrapper";

const NextButton = memo(({ selectedSlot }: { selectedSlot: string | null }) => (
  <div className="absolute w-[345px] h-12 left-1/2 -translate-x-1/2 bottom-[53px]">
    {selectedSlot ? (
      <Link
        href="/confirm"
        className={cn(
          buttonVariants({ variant: "cta", size: "xl" }),
          "w-full h-full bg-[#1d1d1d] rounded-2xl text-white text-base hover:bg-[#1d1d1d]/90"
        )}
      >
        Nästa
      </Link>
    ) : (
      <Button
        disabled
        className="w-full h-full bg-[#1d1d1d] rounded-2xl text-white text-base hover:bg-[#1d1d1d]/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Nästa
      </Button>
    )}
  </div>
));
NextButton.displayName = "NextButton";

export default function BookingPage() {
  const selectedSlot = useBookingStore((state) => state.selectedSlot);

  return (
    <main className="flex justify-center bg-[#ECECEC]">
      <div className="bg-[#ECECEC] w-[393px] h-[852px] relative">
        <PageTitle />
        <RoomSelectorWrapper />
        <DateNavigatorWrapper />
        <div className="absolute w-[345px] h-[426px] top-[298px] left-6">
          <TimeSlotGrid height={423} />
        </div>
        <NextButton selectedSlot={selectedSlot} />
      </div>
    </main>
  );
}