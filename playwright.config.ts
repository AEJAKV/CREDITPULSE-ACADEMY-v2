import { defineConfig } from '@playwright/test';
const baseURL = 'http://127.0.0.1:3020';
export default defineConfig({
  testDir: './tests',
  testMatch: '*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
          args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        }
      : undefined,
    viewport: { width: 1440, height: 1000 },
  },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3020',
    url: baseURL,
    reuseExistingServer: false,
    env: { DEMO_MODE: 'true', APP_URL: baseURL, CP_QA_DIST_DIR: '.next-e2e' },
  },
});
