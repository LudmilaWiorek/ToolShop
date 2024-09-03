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
    console.log('ITEMQUANTITY', itemQuantity)
    return Number.parseInt(itemQuantity)
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
