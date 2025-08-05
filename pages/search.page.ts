import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'

export class SearchPage extends BasePage {
  readonly searchInput: Locator
  constructor(page: Page) {
    super(page)
    this.searchInput = page.locator('#search-query')
  }

  async typeInSearchInput(arg: string): Promise<void> {
    await this.searchInput.fill(arg)
  }
}
