import { test, expect } from '@playwright/test';

test.describe('/api/timeslots edge cases', () => {
  test('missing parameters returns 400', async ({ request }) => {
    const res = await request.get('/api/timeslots');
    expect(res.status()).toBe(400);
  });

  test('invalid date format returns 400', async ({ request }) => {
    const res = await request.get('/api/timeslots?startDate=invalid&endDate=invalid');
    expect(res.status()).toBe(400);
  });
}); 