"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBookingStore } from "@/lib/store/booking";
import { format, addDays, startOfDay } from "date-fns";
import { toUTCDate } from "@/lib/utils/dateHelpers";
import { config } from "@/lib/config";

export function DateNavigator() {
  const { selectedDate, navigateDateRange } = useBookingStore();

  const startDate = selectedDate;
  const endDate = addDays(startDate, config.booking.navigationStep - 1);

  const dateRangeText = `${format(startDate, "MMM d")} - ${format(
    endDate,
    "MMM d"
  )}`;

  const canGoPrevious = () => {
    const today = startOfDay(toUTCDate(new Date()));
    const newDate = addDays(selectedDate, -config.booking.navigationStep)
    return newDate >= today || config.booking.allowPastDates;
  }

  return (
    <div className="w-full flex items-center justify-between">
      <button
        onClick={() => navigateDateRange("prev")}
        disabled={!canGoPrevious()}
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
        className="w-6 h-6 rounded-full flex items-center justify-center border border-black/50 hover:bg-gray-200 transition-colors"
        aria-label="Next dates"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

DateNavigator.displayName = "DateNavigator";