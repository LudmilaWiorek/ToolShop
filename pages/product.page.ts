import { Page } from '@playwright/test'

export class ProductPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  get productName() {
    return this.page.locator('[data-test=product-name]')
  }

  async getProductNameText(): Promise<string> {
    return await this.productName.textContent()
  }

  async assertProductName(expectedName: string): Promise<void> {
    const actualName = await this.getProductNameText()
    if (actualName !== expectedName) {
      throw new Error(
        `Expected product name to be "${expectedName}", but got "${actualName}"`,
      )
    }
  }
}
// class generated by TestCraft also modified a little manually
