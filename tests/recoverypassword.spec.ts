import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'

test('set new password functionality', async ({ page }) => {
  let loginPage: LoginPage
  loginPage = new LoginPage(page)
  const setNewPasswordButton = page.locator('.btnSubmit')
  const forgetPasswordLink = page.locator('.ForgetPwd')
  const emailInput = page.locator('#email')

  await loginPage.goToPage(page)
  await loginPage.signIn.click()
  await forgetPasswordLink.click()
  await emailInput.fill('customer2@practicesoftwaretesting.com')

  await expect(setNewPasswordButton).toBeVisible()
  await setNewPasswordButton.click()
})

// this functionality doesn't work properly!
