import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { RecoveryPassword } from '../pages/recovery.page'

test('set new password functionality', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const recoveryPassword = new RecoveryPassword(page)

  await loginPage.goToPage()
  await loginPage.signIn()
  await recoveryPassword.recoverPassword()

  await expect(recoveryPassword.h3ForgotPassword).toBeVisible()
  await recoveryPassword.setNewPassword()
})

// this functionality doesn't work properly!
