import { test, expect } from "@playwright/test";

test.describe("Booking API Race Condition", () => {
  test("should prevent double booking when requests are concurrent", async ({
    request,
  }) => {
    // Number of concurrent requests to send
    const concurrentRequests = 5;

    // Define a booking payload that will be used for all requests
    const bookingPayload = {
      roomId: 1,
      bookerName: "Race Condition Tester",
      date: "2025-01-01", // A date in the future to avoid past-date errors
      timeSlotId: 1,
      startTime: "08:00",
      endTime: "09:00",
    };

    // Create an array of promises, each being a POST request to create a booking
    const promises = Array(concurrentRequests)
      .fill(null)
      .map(() =>
        request.post("/api/bookings", {
          data: bookingPayload,
        })
      );

    // Execute all requests concurrently and wait for all to settle
    const responses = await Promise.allSettled(promises);

    let successCount = 0;
    let conflictCount = 0;

    // Analyze the results of each request
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
        // Log any unexpected promise rejections
        console.error("A booking request promise was rejected:", response.reason);
      }
    }

    // Assert that exactly one booking succeeded and the rest were conflicts
    expect(successCount).toBe(1);
    expect(conflictCount).toBe(concurrentRequests - 1);
  });
}); 