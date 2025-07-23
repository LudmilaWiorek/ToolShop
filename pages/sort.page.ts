import { Locator, Page } from '@playwright/test'

export class SortPage {
  readonly page: Page
  readonly sortHeader: Locator
  readonly selectForm: Locator
  constructor(page: Page) {
    this.page = page

    this.sortHeader = page
      .locator('//h4[contains(@class, "grid-title")]')
      .nth(0)
    this.selectForm = page.locator('.form-select')
    // Initialization code can go here
  }

  // Method to sort an array of numbers
  sortNumbers(numbers: number[]): number[] {
    return numbers.sort((a, b) => a - b)
  }

  // Method to sort an array of strings
  sortStrings(strings: string[]): string[] {
    return strings.sort()
  }
}
