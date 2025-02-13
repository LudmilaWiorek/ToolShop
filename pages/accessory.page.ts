import * as itemNames from '../JSONS/itemNames.json'
import { Locator, Page } from '@playwright/test'

export class AccessoryPage {
  readonly page: Page

  readonly productAddedMessage: Locator
  readonly cartCount: Locator
  readonly thorHammer: Locator
  readonly saw: Locator
  readonly logoToolShop: Locator
  readonly cartIcon: Locator
  readonly proceedButton: Locator
  readonly messageYouReLogged: Locator
  readonly successButton: Locator

  constructor(page: Page) {
    this.page = page

    this.productAddedMessage = page.getByLabel('Product added to shopping')
    this.cartCount = page.locator('#lblCartCount')
    this.thorHammer = page.locator(
      `//h5[text()="${itemNames.itemName[0].name}"]`,
    )
    this.saw = page.locator(`//h5[text()="${itemNames.itemName[1].name}"]`)
    this.cartIcon = page.locator('//a[@class="nav-link" and @href="/checkout"]')
    this.logoToolShop = page.locator('#Layer_1')
    this.proceedButton = page.locator('[data-test="proceed-2"]')
    this.messageYouReLogged = page.getByText('Hello Jack Howe, you are')
    this.successButton = page.locator("//button[text()='Proceed to checkout']")
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click()
  }
  async confirmCart(): Promise<void> {
    await this.successButton.click()
  }
  async confirmLoginData(): Promise<void> {
    await this.proceedButton.click()
  }
}
