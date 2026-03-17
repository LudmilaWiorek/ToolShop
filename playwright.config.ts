import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import 'tsconfig-paths/register'

export const SESSION_PATH = path.join(__dirname, '././auth/session.json')
export default defineConfig({
  testDir: './tests',
  timeout: 50_000,
  expect: { toPass: { timeout: 1000 } },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://practicesoftwaretesting.com/',
    trace: 'on',
    video: 'off',

    launchOptions: {
      // slowMo: 2000, // UWAGA NA SLOWMO
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
