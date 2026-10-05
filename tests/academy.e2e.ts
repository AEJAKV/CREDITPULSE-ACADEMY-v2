import { test, expect } from '@playwright/test';
test('member curriculum, server tier gate, and verified admin approval', async ({
  page,
  browser,
}) => {
  test.setTimeout(120000);
  await page.goto('/login');
  await page.getByLabel('Email address', { exact: true }).fill('member@creditpulse.demo');
  await page.getByLabel('Password', { exact: true }).fill('LearnWithPulse2026!');
  await page.getByRole('button', { name: 'Continue to my course' }).click();
  await page.waitForURL('**/dashboard');
  await expect(page.locator('.segment-panel')).toHaveCount(6);
  await expect(page.locator('.tier-progress-cell')).toHaveCount(6);
  await expect(page.locator('.tier-progress-cell.is-next')).toContainText('Gold');
  await expect(page.locator('.tier-progress-cell.is-next')).toContainText('Up next');
  await page.goto('/course/credit-mastery/lesson/credit-01');
  await expect(page.getByText('Maya and the $3,400 Winter', { exact: true })).toBeVisible();
  await page.getByLabel('Enter a score', { exact: true }).fill('760');
  await expect(page.locator('.score-live-result').first()).toContainText('Excellent');
  await page.getByLabel('REPORTED BALANCE $', { exact: true }).fill('3500');
  await expect(page.locator('.utilization-result')).toContainText('70');
  await page
    .locator('.quick-checks summary')
    .filter({ hasText: 'You receive a pay raise.' })
    .click();
  await expect(page.getByText('Not a direct score factor', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Focus mode' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-focus', 'true');
  await page.getByRole('button', { name: 'Exit focus' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/courses');
  await expect(page.locator('.course-card')).toHaveCount(6);
  await page.locator('.course-syllabus').first().locator('summary').click();
  await expect(page.getByText('Credit Building After Divorce', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/dashboard');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/course/credit-mastery/lesson/credit-09');
  await page.waitForURL('**/segment/3');
  const origin = 'http://127.0.0.1:3020';
  const request = page.context().request;
  const locked = await request.post('/api/member', {
    headers: { Origin: origin },
    data: {
      action: 'complete',
      courseId: 'credit-mastery',
      lessonId: 'credit-09',
      answer: 1,
      reflection: 'One small action.',
    },
  });
  expect(locked.status()).toBe(403);
  for (const lessonId of ['credit-05', 'credit-06', 'credit-07', 'credit-08']) {
    const response = await request.post('/api/member', {
      headers: { Origin: origin },
      data: {
        action: 'complete',
        courseId: 'credit-mastery',
        lessonId,
        answer: 1,
        reflection: 'Set a payment reminder.',
      },
    });
    expect(response.status()).toBe(200);
  }
  await page.goto('/course/credit-mastery/complete/2');
  await expect(page.getByRole('heading', { name: 'You finished Silver.' })).toBeVisible();
  await page.getByRole('button', { name: 'Reapply to claim more cash back' }).click();
  await expect(page.getByText('Your request is with the course team.')).toBeVisible();
  const stillLocked = await request.post('/api/member', {
    headers: { Origin: origin },
    data: {
      action: 'complete',
      courseId: 'credit-mastery',
      lessonId: 'credit-09',
      answer: 1,
      reflection: 'One small action.',
    },
  });
  expect(stillLocked.status()).toBe(403);
  const adminContext = await browser.newContext({ baseURL: origin });
  try {
    const admin = await adminContext.newPage();
    await admin.goto('/login');
    await admin.getByLabel('Email address', { exact: true }).fill('admin@creditpulse.demo');
    await admin.getByLabel('Password', { exact: true }).fill('ManageWithPulse2026!');
    await admin.getByRole('button', { name: 'Continue to my course' }).click();
    await admin.waitForURL('**/admin');
    await admin.goto('/admin/curriculum?course=benefits-support');
    await expect(admin.getByText('Canada Child Benefit', { exact: false })).toBeVisible();
    await expect(admin.locator('tbody tr')).toHaveCount(30);
    await admin.goto('/admin/curriculum/credit-01');
    await expect(admin.getByLabel('Complete lesson content (JSON)')).toHaveValue(
      /Maya and the \$3,400 Winter/,
    );
    await admin.goto('/admin/approvals');
    await admin.getByLabel('Verified approval / review reference').fill('TEST-VERIFIED-APPROVAL');
    await admin.getByRole('button', { name: 'Record verified decision' }).click();
    await expect(admin.getByRole('heading', { name: 'You’re up to date.' })).toBeVisible();
    await page.goto('/course/credit-mastery/lesson/credit-09');
    await expect(
      page.getByRole('heading', { name: 'Hard and Soft Credit Inquiries', exact: true }),
    ).toBeVisible();
  } finally {
    await adminContext.close();
  }
});
