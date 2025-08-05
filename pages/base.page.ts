import { Page } from '@playwright/test'

export class BasePage {
  url = ''
  successfulUrl = /.*\/account/ // default successful URL, can be overridden in child classes
  constructor(protected page: Page) {} // protected - we don't use page outside of pages

  async goto(parameters = ''): Promise<void> {
    // we don't indicate type of parameter - it is automatically selected from the value
    await this.page.goto(`${this.url}${parameters}`)
  }
  async getTitle(): Promise<string> {
    await this.page.waitForLoadState()
    return await this.page.title()
  }
  async waitForPageToLoadUrl(): Promise<void> {
    await this.page.waitForURL(this.url)
  }
  async waitForSuccessfulUrl(): Promise<void> {
    await this.page.waitForURL(this.successfulUrl)
  }
}
