import { defineConfig, devices } from '@playwright/test'

require('dotenv').config()
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  // expect: { timeout: 30_000 },
  expect: { toPass: { timeout: 1000 } },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://practicesoftwaretesting.com/',
    trace: 'on',
    launchOptions: {
      // slowMo: 5000, // UWAGA NA SLOWMO
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
