import { Locator, Page } from '@playwright/test'
import {
  BankTransferModel,
  BuyNowPayLaterModel,
  CreditCardModel,
  GiftCardModel,
  PaymentModel,
} from '../models/payment.model'

export class PaymentPage {
  readonly page: Page

  readonly paymentMethod: Locator
  readonly h3Payment: Locator
  readonly bankNameInput: Locator
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
  readonly orderSuccessfulMessage: Locator
  readonly bankNameAlert: Locator

  constructor(page: Page) {
    this.page = page

    this.paymentMethod = page.locator('#payment-method') // dropdown
    this.h3Payment = page.locator('//h3[text()="Payment"]')
    this.bankNameInput = page.locator('#bank_name')
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
    this.orderSuccessfulMessage = page.locator('#order-confirmation')
    this.bankNameAlert = page.locator(
      '//div[text()=" Bank name can only contain letters and spaces. "]',
    )
  }
  // note: add locators to red alerts!
  async choosePaymentMethod(paymentType: PaymentModel): Promise<void> {
    await this.paymentMethod.selectOption(paymentType.method)
  }

  async fillBankData(bankForm: BankTransferModel): Promise<void> {
    await this.bankNameInput.fill(bankForm.bankName)
    await this.accountName.fill(bankForm.accountName)
    await this.accountNumber.fill(bankForm.accountNumber)
  }

  async validateBankName(bankName: string): Promise<void> {
    const regexBankName = /^[A-Za-z\ ]+$/
    if (!regexBankName.test(bankName)) {
      throw 'Bank name can only contain letters and spaces.'
    }
  }

  async chooseCashOnDelivery() {}
  // ? no form to fill

  async fillCreditCardData(cardData: CreditCardModel) {
    await this.creditCardNumber.fill(cardData.creditCardNumber)
    await this.expirationDate.fill(cardData.expirationDate)
    await this.cvvCode.fill(cardData.CVV)
    await this.cardHolderName.fill(cardData.cardHolderName)
  }

  async chooseBuyNowPayLater(
    chooseInstallment: BuyNowPayLaterModel,
  ): Promise<void> {
    await this.monthlyInstallments.selectOption(chooseInstallment.installment)
  }

  async fillGiftCard(giftCardData: GiftCardModel) {
    await this.giftCardNumber.fill(giftCardData.giftCardNumber)
    await this.validationCode.fill(giftCardData.validationCode)
  }

  async confirmPayment(): Promise<void> {
    await this.confirmButton.click()
  }
  // main switch payment function
  async fillPaymentForm(paymentObject: PaymentModel) {
    await this.choosePaymentMethod(paymentObject)
    switch (paymentObject.method) {
      case 'Bank Transfer':
        // await this.choosePaymentMethod(paymentObject)
        if (paymentObject.bankTransferModel === undefined)
          throw new Error('no data about bank transfer model')

        await this.fillBankData(paymentObject.bankTransferModel)
        break

      case 'Cash on Delivery':
        // await this.choosePaymentMethod(paymentObject)
        break

      case 'Credit Card':
        // await this.choosePaymentMethod(paymentObject)
        if (paymentObject.creditCardModel === undefined)
          throw new Error('no data about credit card model')

        await this.fillCreditCardData(paymentObject.creditCardModel)
        break

      case 'Buy Now Pay Later':
        // await this.choosePaymentMethod(paymentObject)
        if (paymentObject.buyNowPayLaterModel === undefined)
          throw new Error('no data about buy now pay later model')
        await this.chooseBuyNowPayLater(paymentObject.buyNowPayLaterModel)
        break

      case 'Gift Card':
        // await this.choosePaymentMethod(paymentObject)
        if (paymentObject.giftCardModel === undefined)
          throw new Error('no data about gift card model')

        await this.fillGiftCard(paymentObject.giftCardModel)
        break

      default:
        console.log('❌There is no such payment method')
        break
    }
  }
}
