import { Locator, Page } from '@playwright/test'

export class SearchPage {
  readonly page: Page
  readonly searchInput: Locator
  constructor(page: Page) {
    this.page = page

    this.searchInput = page.locator('#search-query')
  }
}
