import { LineItem } from '../models/lineItem.model'
import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'

export class ToolsPage extends BasePage {
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
    super(page)

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

  async addToCart(arrayProducts: LineItem[]): Promise<void> {
    await this.addToCartButton.click({ timeout: 3000 })
    const dataProduct: LineItem = {
      name: await this.name.innerText(),
      quantity: Number.parseInt(await this.quantity.inputValue()),
      price: Number.parseFloat(await this.price.innerText()),
    }
    await arrayProducts.push(dataProduct)
  }

  async getItemAmountInArrayCart(arrayProducts: LineItem[]): Promise<number> {
    let sumOfProducts = 0
    for (let i = 0; i < arrayProducts.length; i++) {
      sumOfProducts += arrayProducts[i].quantity
    }
    return sumOfProducts
  }

  async chooseItem(itemName: string): Promise<void> {
    const dynamicItemName = this.page.locator(`//*[text()="${itemName}"]`)
    await dynamicItemName.click({ timeout: 3000 })
  }

  async increaseItemCount(): Promise<void> {
    await this.increaseButton.click()
  }

  async decreaseItemCount(): Promise<void> {
    await this.decreaseButton.click()
  }

  async changeItemAmount(amount: number): Promise<void> {
    await this.quantity.fill(`${amount}`)
  }

  async search(itemName: string): Promise<void> {
    await this.searchInput.fill(itemName)
    await this.searchInput.press('Enter')
  }
}
