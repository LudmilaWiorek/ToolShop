import { Locator, Page } from '@playwright/test'

export class CartPage {
  readonly page: Page

  readonly itemName: Locator

  constructor(page: Page) {
    this.page = page

    this.itemName = page.locator('.product-title')
  }

  async getItemCount(): Promise<Locator> {

    return this.itemName

  }

  async getTotal(): Promise<Number> {
    //method counting price of products in cart
  }
}
