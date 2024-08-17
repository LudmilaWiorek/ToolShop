import { Locator, Page } from '@playwright/test'

export class CartPage {
  readonly page: Page

  readonly itemName: Locator

  constructor(page: Page) {
    this.page = page

    this.itemName = page.locator('//tbody/tr')
  }

  async getName(itemLocator: Locator): Promise<Locator> {
    return itemLocator.locator('.product-title')
  }
  async getQuantity(quantity: Locator): Promise<Locator> {
    return quantity.locator('.form-control.quantity')
  }

  getPrice

  async getTotal(): Promise<Number> {
    //method counting price of products in cart
  }
}
