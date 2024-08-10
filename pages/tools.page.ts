import { Locator, Page } from '@playwright/test'

export class ToolsPage {
  readonly page: Page

  readonly searchInput: Locator
  readonly addToCartButton: Locator
  readonly cartCount: Locator
  readonly sumTotal: Locator
 

  constructor(page: Page) {
    this.page = page

    this.searchInput = page.locator('[data-test="search-query"]')
    this.addToCartButton = page.locator('#btn-add-to-cart')
    this.cartCount = page.locator('#lblCartCount')
    this.sumTotal = page.locator('//tfoot/tr/td[4]')
  }

  async addToCart() {
    await this.addToCartButton.click()
  }

  async chooseItem(itemName: string) {
    const dynamicItemName = this.page.locator(`//*[text()="${itemName}"]`)
    await dynamicItemName.click()
  }

  async search(itemName: string) {
    await this.searchInput.fill(itemName)
    await this.searchInput.press('Enter')
  }

  async getTotal(): Promise<Number> {
    
    //method counting price of products in cart
  }

 
}
