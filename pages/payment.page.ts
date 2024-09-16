import { Locator, Page } from '@playwright/test'
import {
  paymentModel,
  bankTransferModel,
  creditCardModel,
  giftCardModel,
} from '../models/payment.model'

export class PaymentPage {
  readonly page: Page

  readonly paymentMethod: Locator
  readonly h3Payment: Locator
  readonly bankName: Locator
  readonly accountName: Locator
  readonly accountNumber: Locator
  readonly paymentSuccessful: Locator
  readonly creditCardNumber: Locator
  readonly creditCardNumberHelper: Locator
  readonly expirationDate: Locator
  readonly cvvCode: Locator
  readonly cvvHelper: Locator
  readonly cardHolderName: Locator
  readonly monthlyInstallments: Locator
  readonly monthlyHelper: Locator
  readonly giftCardNumber: Locator
  readonly giftCardNumberHelper: Locator
  readonly validationCode: Locator
  readonly confirmButton: Locator

  constructor(page: Page) {
    this.page = page

    this.paymentMethod = page.locator('#payment-method') // dropdown
    this.h3Payment = page.locator('//h3[text()="Payment"]')
    this.bankName = page.locator('#bank_name')
    this.accountName = page.locator('#account_name')
    this.accountNumber = page.locator('#account_number')
    this.paymentSuccessful = page.locator(
      '//*[text()="Payment was successful"]',
    )
    this.creditCardNumber = page.locator('#credit_card_number')
    this.expirationDate = page.locator('#expiration_date')
    this.cvvCode = page.locator('#cvv')
    this.cardHolderName = page.locator('#card_holder_name')
    this.monthlyInstallments = page.locator('#monthly_installments') // dropdown
    this.monthlyHelper = page.locator('#monthly_installments_help')
    this.giftCardNumber = page.locator('#gift_card_number')
    this.validationCode = page.locator('#validation_code')
    this.confirmButton = page.locator('//button[text()=" Confirm "]')
  }
  // add locators to red allerts!
  async choosePaymentMethod(paymentType: paymentModel): Promise<void> {
    await this.paymentMethod.selectOption(paymentType.method)
  }

  async chooseBankTransfer(bankForm: bankTransferModel): Promise<void> {
    await this.paymentMethod.selectOption('Bank Transfer')
    await this.bankName.fill(bankForm.bankName)
    await this.accountName.fill(bankForm.accountName.toString()) // regex

    // accountName: "/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\s.'-]+$/"

    await this.accountNumber.fill(bankForm.accountNumber.toString())
  }

  async chooseCashOnDelivery() {}
  // ? no form to fill
  async chooseCreditCard() {}

  async chooseBuyNowPayLater() {}

  async chooseGiftCard() {}

  async confirmPayment(): Promise<void> {
    await this.confirmButton.click()
  }
}
