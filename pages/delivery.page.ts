import { Locator, Page } from '@playwright/test'

export interface billingAddressModel {
  address: string
  city: string
  state: string
  country: string
  postCode: string
}

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

  async fillDeliveryFormular(address: billingAddressModel) {
    await this.address.fill(address.address)
    await this.city.fill(address.city)
    await this.state.fill(address.state)
    await this.country.fill(address.country)
    await this.postCode.fill(address.postCode)
  }
}
