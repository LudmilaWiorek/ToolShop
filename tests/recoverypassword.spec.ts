import { expect, fixtures as test } from '@fixtures/pages.fixture'
import { LoginPage } from '@pages/authentication/login.page'

test('set new password functionality', async ({ page, recoveryPage }) => {
  const loginPage = new LoginPage(page)

  await loginPage.goToPage()
  await loginPage.signIn()
  await recoveryPage.recoverPassword()

  await expect(recoveryPage.h3ForgotPassword).toBeVisible()
  await recoveryPage.setNewPassword()
})

// this functionality doesn't work properly!
