import { SESSION_PATH } from '../playwright.config'
import { expect, test } from '@playwright/test'

test.use({
  storageState: SESSION_PATH,
})
test('using session from login-with-sesion test', async ({ page }) => {
  await page.goto('/account')

  await expect(page).toHaveURL('https://practicesoftwaretesting.com/account')
})
