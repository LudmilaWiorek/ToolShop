import { Locator, Page } from '@playwright/test'

export class CartPage {
  readonly page: Page

  readonly itemNameLocator: Locator
  readonly totalSumLocator: Locator
  constructor(page: Page) {
    this.page = page

    this.itemNameLocator = page.locator('//tbody/tr')
    this.totalSumLocator = page.locator('//tfoot/tr/td[4]')
  }
  async getItemsAmount(): Promise<number> {
    await this.itemNameLocator.last().waitFor()
    return this.itemNameLocator.count()
  }

  async getName(position: number): Promise<String> {
    // we get text from the locator part "Item" of lineItem in basket (that has class .product-title)

    const itemName = await this.itemNameLocator
      .nth(position)
      .locator('.product-title')
      .innerText()
    //  we remove space from the end
    return itemName.trim()
  }

  async getQuantity(position: number): Promise<number> {
    const itemQuantity = await this.itemNameLocator
      .nth(position)
      .locator('.form-control.quantity')
      .inputValue()
    return Number.parseInt(itemQuantity)
  }

  async getPrice(position: number): Promise<number> {
    const itemPrice = (
      await this.itemNameLocator
        .nth(position)
        .locator('//td[3]/span')
        .innerText()
    ).replace('$', '')

    return Number.parseFloat(itemPrice)
    // we check for a row with price, loop check inside for values
  }

  async getTotal(position: number): Promise<number> {
    const itemPriceTotal = (
      await this.itemNameLocator
        .nth(position)
        .locator('//td[4]/span')
        .innerText()
    ).replace('$', '')

    return Number.parseFloat(itemPriceTotal)
  }

  async getCartTotal(): Promise<number> {
    const itemSumTotal = (await this.totalSumLocator.innerText()).replace(
      '$',
      '',
    )

    return Number.parseFloat(itemSumTotal)
  }
}
