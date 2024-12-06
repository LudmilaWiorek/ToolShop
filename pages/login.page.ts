import { Locator, Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page

  readonly signInIcon: Locator
  readonly dataTestEmail: Locator
  readonly dataTestPassword: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly myAccountTitle: Locator

  constructor(page: Page) {
    this.page = page
    this.signInIcon = page.locator('[data-test="nav-sign-in"]')
    this.dataTestEmail = page.locator('[data-test="email"]')
    this.dataTestPassword = page.locator('[data-test="password"]')
    this.submitButton = page.locator('[data-test="login-submit"]')
    this.errorMessage = page.locator('.help-block')
    this.myAccountTitle = page.locator('[data-test="page-title"]')
  }
  async goToPage(): Promise<void> {
    await this.page.goto('/')
  }
  async signIn(): Promise<void> {
    await this.signInIcon.click()
  }
  async login(dataTestEmail: string, dataTestPassword: string): Promise<void> {
    await this.signInIcon.click()

    await this.dataTestEmail.fill(dataTestEmail)
    await this.page.waitForTimeout(500)
    await this.dataTestPassword.fill(dataTestPassword)
    await this.submitButton.click()
  }
}
