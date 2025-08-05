import { RegistrationModel } from '../models/registration.model'
import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'

export class RegistrationPage extends BasePage {
  readonly registerLink: Locator
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly birthDate: Locator
  readonly streetInput: Locator
  readonly postCode: Locator
  readonly city: Locator
  readonly state: Locator
  readonly country: Locator
  readonly phone: Locator
  readonly email: Locator
  readonly password: Locator
  readonly registerButton: Locator

  constructor(page: Page) {
    super(page)
    this.registerLink = page.locator('[data-test="register-link"]')
    this.firstNameInput = page.locator('[data-test="first-name"]')
    this.lastNameInput = page.locator('[data-test="last-name"]')
    this.birthDate = page.locator('[data-test="dob"]')
    this.streetInput = page.locator('#street')
    this.postCode = page.locator('#postal_code')
    this.city = page.locator('#city')
    this.state = page.locator('[data-test="state"]')
    this.country = page.locator('[data-test="country"]')
    this.phone = page.locator('[data-test="phone"]')
    this.email = page.locator('[data-test="email"]')
    this.password = page.locator('[data-test="password"]')
    this.registerButton = page.locator('[data-test="register-submit"]')
  }
  async goToRegPage(): Promise<void> {
    await this.page.goto('/auth/register')
  }
  async registerUser(user: RegistrationModel): Promise<void> {
    await this.firstNameInput.fill(user.firstName)
    await this.lastNameInput.fill(user.lastName)
    await this.birthDate.fill(user.birthDate)
    await this.streetInput.fill(user.address)
    await this.postCode.fill(user.postCode)
    await this.city.fill(user.city)
    await this.state.fill(user.state)
    await this.country.selectOption(user.country)
    await this.phone.fill(user.phone)
    await this.email.fill(user.email)
    await this.password.fill(user.password)
    await this.registerButton.click()
  }
}
