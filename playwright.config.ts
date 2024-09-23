import { defineConfig, devices } from '@playwright/test'
require('dotenv').config()
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

export default defineConfig({
  testDir: './tests',
  timeout: 70_000,
  expect: { timeout: 30_000 },
  // use: { slowMo: 600 },

  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  use: {
    baseURL: 'https://practicesoftwaretesting.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
