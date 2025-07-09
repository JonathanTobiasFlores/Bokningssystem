"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBookingStore } from "@/lib/store/booking";
import { format, addDays, startOfDay, differenceInDays } from "date-fns";
import { toUTCDate } from "@/lib/utils/dateHelpers";
import { config } from "@/lib/config";

export function DateNavigator() {
  const { selectedDate, navigateDateRange, selectedRooms } = useBookingStore();

  const startDate = selectedDate;
  const endDate = addDays(startDate, config.booking.navigationStep - 1);

  const dateRangeText = `${format(startDate, "MMM d")} - ${format(
    endDate,
    "MMM d"
  )}`;

  const isRoomSelected = selectedRooms.length > 0;

  const canGoPrevious = () => {
    const today = startOfDay(toUTCDate(new Date()));
    const newDate = addDays(selectedDate, -config.booking.navigationStep);
    return newDate >= today || config.booking.allowPastDates;
  };

  const canGoNext = () => {
    const today = startOfDay(new Date());
    const nextRangeEndDate = addDays(
      selectedDate,
      2 * config.booking.navigationStep - 1
    );
    return (
      differenceInDays(nextRangeEndDate, today) <= config.booking.maxAdvanceDays
    );
  };

  return (
    <div className="w-full flex items-center justify-between">
      <button
        onClick={() => navigateDateRange("prev")}
        disabled={!isRoomSelected || !canGoPrevious()}
        className="w-6 h-6 rounded-full flex items-center justify-center border border-black/50 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous dates"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
      </button>

      <span className="text-base font-medium text-[#1C1B1F]">
        {dateRangeText}
      </span>

      <button
        onClick={() => navigateDateRange("next")}
        disabled={!isRoomSelected || !canGoNext()}
        className="w-6 h-6 rounded-full flex items-center justify-center border border-black/50 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next dates"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

DateNavigator.displayName = "DateNavigator";