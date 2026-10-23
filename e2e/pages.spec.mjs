import { expect, test } from '@playwright/test';

import { layoutProblems } from './layoutCheck.mjs';

// Pages that render without the backend, so CI can test them on a fresh build.
const DEFAULT_PATHS = ['/', '/store', '/teracom-ai', '/contact', '/tools', '/admin/login'];
const PATHS = (process.env.E2E_PATHS || '').split(',').map((path) => path.trim()).filter(Boolean);

for (const path of PATHS.length ? PATHS : DEFAULT_PATHS) {
  test(`${path} looks right`, async ({ page }, testInfo) => {
    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response && response.status(), `${path} answered`).toBeLessThan(400);
    const problems = await layoutProblems(page);
    await testInfo.attach(`${testInfo.project.name}${path.replace(/[^a-z0-9]+/gi, '-')}.png`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
    expect(problems, `${path} on ${testInfo.project.name}`).toEqual([]);
  });
}

// The check itself is tested: the same page with its stylesheet blocked must be caught.
test('a page with no stylesheet fails the check', async ({ page }) => {
  await page.route(/[.]css([?].*)?$/, (route) => route.abort());
  const path = PATHS.length ? PATHS[0] : '/';
  await page.goto(path, { waitUntil: 'networkidle' });
  const problems = await layoutProblems(page);
  expect(problems).toContain('the page shows browser default styling');
});
