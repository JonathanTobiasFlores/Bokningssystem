import { test, expect } from '@playwright/test';

// Simple sanity check for /api/timeslots

test('GET /api/timeslots returns slot data', async ({ request }) => {
  const today = new Date().toISOString().split('T')[0];
  const res = await request.get(`/api/timeslots?startDate=${today}&endDate=${today}`);
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(Array.isArray(body.data)).toBeTruthy();
}); 