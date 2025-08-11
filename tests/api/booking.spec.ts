import { test, expect } from "@playwright/test";

test.describe("Booking API Race Condition", () => {
  test.skip("should prevent double booking when requests are concurrent", async ({
    request,
  }) => {
    const concurrentRequests = 2;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const dateString = futureDate.toISOString().split("T")[0];

    const bookingPayload = {
      roomId: 1,
      userName: "Race Condition Tester",
      date: dateString,
      timeSlotId: 1,
      startTime: "08:00",
      endTime: "09:00",
    };

    const promises = Array(concurrentRequests)
      .fill(null)
      .map(() =>
        request.post("/api/bookings", {
          data: bookingPayload,
        })
      );

    const responses = await Promise.allSettled(promises);

    let successCount = 0;
    let conflictCount = 0;

    for (const response of responses) {
      if (response.status === "fulfilled") {
        const json = await response.value.json();
        const status = response.value.status();

        if (status === 201 && json.success === true) {
          successCount++;
        } else if (
          status === 409 &&
          json.code === "BOOKING_CONFLICT"
        ) {
          conflictCount++;
        }
      } else {
        console.error("A booking request promise was rejected:", response.reason);
      }
    }

    expect(successCount).toBe(1);
    expect(conflictCount).toBe(concurrentRequests - 1);
  });
}); 