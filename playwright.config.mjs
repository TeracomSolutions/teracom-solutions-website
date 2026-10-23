import { defineConfig, devices } from '@playwright/test';

// Screenshot tests for the pages people see (best-practice roadmap item 8, 2026-10-25).
// E2E_BASE_URL picks the copy to test (default: the production build CI starts on port 3001);
// E2E_PATHS (comma separated) narrows the pages, for example /admin/login for the Luneva console.
export default defineConfig({
  testDir: './e2e',
  testMatch: /.*[.]spec[.]mjs$/,
  outputDir: 'e2e-results',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e-report' }]],
  retries: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3001',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
});
