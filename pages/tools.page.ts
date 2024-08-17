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
  }

  async addToCart(arrayProducts: lineItem[]) {
    await this.addToCartButton.click()
    const dataProduct: lineItem = {
      name: await this.name.innerText(),
      quantity: await this.quantity.inputValue(),
      price: await this.price.innerText(),
    }
    await arrayProducts.push(dataProduct)
  }

  async chooseItem(itemName: string) {
    const dynamicItemName = this.page.locator(`//*[text()="${itemName}"]`)
    await dynamicItemName.click()
  }

  async search(itemName: string) {
    await this.searchInput.fill(itemName)
    await this.searchInput.press('Enter')
  }
}
