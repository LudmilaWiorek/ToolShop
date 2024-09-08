import { Locator, Page } from '@playwright/test'
import { lineItem } from '../models/lineItem.model'

export class ToolsPage {
  readonly page: Page

  readonly searchInput: Locator
  readonly addToCartButton: Locator
  readonly cartCount: Locator
  readonly sumTotal: Locator
  readonly name: Locator
  readonly quantity: Locator
  readonly price: Locator
  readonly increaseButton: Locator
  readonly decreaseButton: Locator

  constructor(page: Page) {
    this.page = page

    this.searchInput = page.locator('[data-test="search-query"]')
    this.addToCartButton = page.locator('#btn-add-to-cart')
    this.cartCount = page.locator('#lblCartCount')
    this.sumTotal = page.locator('//tfoot/tr/td[4]')
    this.name = page.locator('//h1[@data-test="product-name"]')
    this.quantity = page.locator('#quantity-input')
    this.price = page.locator('//span[@data-test="unit-price"]')
    this.increaseButton = page.locator('#btn-increase-quantity')
    this.decreaseButton = page.locator('#btn-decrease-quantity')
  }

  async addToCart(arrayProducts: lineItem[]) {
    await this.addToCartButton.click()
    const dataProduct: lineItem = {
      name: await this.name.innerText(),
      quantity: Number.parseInt(await this.quantity.inputValue()),
      price: Number.parseFloat(await this.price.innerText()),
    }
    await arrayProducts.push(dataProduct)
  }

  async getItemAmountInArrayCart(arrayProducts: lineItem[]): Promise<number> {
    let sumOfProducts = 0
    for (let i = 0; i < arrayProducts.length; i++) {
      sumOfProducts += arrayProducts[i].quantity
    }

    return sumOfProducts
  }

  async chooseItem(itemName: string) {
    const dynamicItemName = this.page.locator(`//*[text()="${itemName}"]`)
    await dynamicItemName.click()
  }

  async increaseItemCount() {
    await this.increaseButton.click()
  }

  async decreaseItemCount() {
    await this.decreaseButton.click()
  }

  async changeItemAmount(amount: number) {
    await this.quantity.fill(`${amount}`)
  }
  async search(itemName: string) {
    await this.searchInput.fill(itemName)
    await this.searchInput.press('Enter')
  }
}
