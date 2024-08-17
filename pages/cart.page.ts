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
  async getPrice(productPrice: Locator): Promise<Locator> {
    return productPrice.locator('//td[3]/span')
    // we check for a row with price, loop check inside for values
  }

  async getTotal(totalPriceForProduct: Locator): Promise<Locator> {
    return totalPriceForProduct.locator('//td[4]/span')
  }

  async checkTotal(itemLocator: Locator): Promise<Boolean> {
    const quantityLocator = await this.getQuantity(itemLocator)
    const quantityString = await quantityLocator.inputValue()
    const quantity = Number.parseInt(quantityString)
    const priceLocator = await this.getPrice(itemLocator)
    const priceString = (await priceLocator.innerText()).replace('$', '')
    const price = Number.parseFloat(priceString)
    const totalPriceLocator = await this.getTotal(itemLocator)
    const totalPriceString = (await totalPriceLocator.innerText()).replace(
      '$',
      '',
    )

    const totalPrice = Number.parseFloat(totalPriceString)
    return quantity * price === totalPrice
  }
}
