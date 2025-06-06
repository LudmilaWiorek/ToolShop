import { BillingAddress } from '../models/billingAddress.model'
import { Locator, Page } from '@playwright/test'

export class DeliveryPage {
  readonly page: Page

  readonly street: Locator
  readonly city: Locator
  readonly state: Locator
  readonly country: Locator
  readonly postCode: Locator
  readonly billingButton: Locator

  constructor(page: Page) {
    this.page = page
    // this.address = page.locator('#address')
    this.street = page.locator('#street')
    this.city = page.locator('#city')
    this.state = page.locator('#state')
    this.country = page.locator('#country')
    this.postCode = page.locator('#postal_code')
    this.billingButton = page.locator('//button[@data-test="proceed-3"]')
  }

  async fillDeliveryForm(address: BillingAddress): Promise<void> {
    await this.street.fill(address.street)
    await this.city.fill(address.city)
    await this.state.fill(address.state)
    await this.country.fill(address.country)
    await this.postCode.fill(address.postCode)
  }

  billingAddress: BillingAddress = {
    street: 'Sezamkowa 3/30',
    city: 'Warsaw',
    state: 'mazowieckie',
    country: 'Poland',
    postCode: '03-022',
  }
  async confirmAddress(): Promise<void> {
    await this.billingButton.click()
  }
}
