import * as users from '../JSONS/users.json'
import { Locator, Page } from '@playwright/test'

export class RecoveryPage {
  readonly page: Page
  readonly forgetPasswordLink: Locator
  readonly emailInput: Locator
  readonly setNewPasswordButton: Locator
  readonly h3ForgotPassword: Locator

  constructor(page: Page) {
    this.page = page
    this.forgetPasswordLink = page.locator('.ForgetPwd')
    this.emailInput = page.locator('#email')
    this.setNewPasswordButton = page.locator('.btnSubmit')
    this.h3ForgotPassword = page.locator('//h3[text()="Forgot Password"]')
  }

  async recoverPassword(): Promise<void> {
    const dataEmail = users.userdata.user[0].email
    await this.forgetPasswordLink.click()
    await this.emailInput.fill(dataEmail)
  }
  async setNewPassword(): Promise<void> {
    await this.setNewPasswordButton.click()
  }
}
