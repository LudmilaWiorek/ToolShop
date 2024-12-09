import { LoginPage } from '../pages/login.page'
import { RegistrationPage } from '../pages/registration.page'
import { expect, test } from '@playwright/test'

test.describe('registration tests', () => {
  test('new registration test', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const registrationPage = new RegistrationPage(page)
    await loginPage.goToPage()
    await loginPage.signIn()
    await registrationPage.registerUser()
    await expect(page).toHaveURL(
      'https://practicesoftwaretesting.com/auth/login',
    )
  })
})
