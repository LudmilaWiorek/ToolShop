import { Locator, Page } from '@playwright/test'
import { BillingAddress } from '../models/billingAddress.model'

export class DeliveryPage {
  readonly page: Page

  readonly address: Locator
  readonly city: Locator
  readonly state: Locator
  readonly country: Locator
  readonly postCode: Locator

  constructor(page: Page) {
    this.page = page
    this.address = page.locator('#address')
    this.city = page.locator('#city')
    this.state = page.locator('#state')
    this.country = page.locator('#country')
    this.postCode = page.locator('#postcode')
  }

  async fillDeliveryForm(address: BillingAddress) {
    await this.address.fill(address.address)
    await this.city.fill(address.city)
    await this.state.fill(address.state)
    await this.country.fill(address.country)
    await this.postCode.fill(address.postCode)
  }
}
