import { Locator, Page } from '@playwright/test'
import { BillingAddress } from '../models/billingAddress.model'

export class DeliveryPage {
  readonly page: Page

  readonly address: Locator
  readonly city: Locator
  readonly state: Locator
  readonly country: Locator
  readonly postCode: Locator
  readonly billingButton: Locator

  constructor(page: Page) {
    this.page = page
    this.address = page.locator('#address')
    this.city = page.locator('#city')
    this.state = page.locator('#state')
    this.country = page.locator('#country')
    this.postCode = page.locator('#postcode')
    this.billingButton = page.locator('//button[@data-test="proceed-3"]')
  }

  async fillDeliveryForm(address: BillingAddress): Promise<void> {
    await this.address.fill(address.address)
    await this.city.fill(address.city)
    await this.state.fill(address.state)
    await this.country.fill(address.country)
    await this.postCode.fill(address.postCode)
  }

  billingAddress: BillingAddress = {
    address: 'Sezamkowa 3/30',
    city: 'Warsaw',
    state: 'mazowieckie',
    country: 'Poland',
    postCode: '03-022',
  }
  async confirmAddress(): Promise<void> {
    await this.billingButton.click()
  }
}
