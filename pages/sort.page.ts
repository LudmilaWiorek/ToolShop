import { OrderByEnum } from '../enums/orderBy.enum'
import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'

export class SortDropdownPage extends BasePage {
  readonly sortHeader: Locator
  readonly selectForm: Locator
  readonly productNameHeaders: Locator

  constructor(page: Page) {
    super(page)

    this.sortHeader = this.page
      .locator('//h4[contains(@class, "grid-title")]')
      .nth(0)
    this.selectForm = this.page.locator('.form-select')
    this.productNameHeaders = this.page.locator('h5')
  }

  async clickSortOption(): Promise<void> {
    await this.selectForm.click()
  }

  async selectOrderOption(orderBy: OrderByEnum): Promise<void> {
    await this.selectForm.selectOption({ value: orderBy })
  }

  async getProductNames(): Promise<string[]> {
    const productNames: string[] =
      await this.productNameHeaders.allTextContents()
    return productNames
  }
}
