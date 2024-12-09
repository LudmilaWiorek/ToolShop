import { Locator, Page } from '@playwright/test'

export class RegistrationPage {
  readonly page: Page

  readonly registerLink: Locator
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly dateOfBirth: Locator
  readonly addressInput: Locator
  readonly postCode: Locator
  readonly city: Locator
  readonly state: Locator
  readonly country: Locator
  readonly phone: Locator
  readonly email: Locator
  readonly password: Locator
  readonly registerButton: Locator

  constructor(page: Page) {
    this.page = page
    this.registerLink = page.locator('[data-test="register-link"]')
    this.firstNameInput = page.locator('[data-test="first-name"]')
    this.lastNameInput = page.locator('[data-test="last-name"]')
    this.dateOfBirth = page.locator('[data-test="dob"]')
    this.addressInput = page.locator('[data-test="address"]')
    this.postCode = page.locator('[data-test="postcode"]')
    this.city = page.locator('[data-test="city"]')
    this.state = page.locator('[data-test="state"]')
    this.country = page.locator('[data-test="country"]')
    this.phone = page.locator('[data-test="phone"]')
    this.email = page.locator('[data-test="email"]')
    this.password = page.locator('[data-test="password"]')
    this.registerButton = page.locator('[data-test="register-submit"]')
  }

  async registerUser(): Promise<void> {
    await this.registerLink.click()
    await this.firstNameInput.fill('Tom')
    await this.lastNameInput.fill('Riddle')
    await this.dateOfBirth.fill('2000-01-01')
    await this.addressInput.fill('Elm street 14')
    await this.postCode.fill('10-100')
    await this.city.fill('City')
    await this.state.fill('State')
    await this.country.selectOption('US')
    await this.phone.fill('123456789')
    await this.email.fill('TomRiddle22345556@test.com')
    await this.password.fill('NightmareOfTheElmStreet12#')
    await this.registerButton.click()
  }
}

