import { Locator, Page } from '@playwright/test'
import {
  PaymentModel,
  BankTransferModel,
  CreditCardModel,
  GiftCardModel,
  BuyNowPayLaterModel,
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
  }
  // note: add locators to red alerts!
  // is choosePaymentMethod used?
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

  async fillPaymentForm(paymentPage: PaymentPage, paymentMethod: string) {
    switch (paymentMethod) {
      case 'Bank Transfer':
        const paymentBankTransfer: PaymentModel = {
          method: 'Bank Transfer',
        }
        await paymentPage.choosePaymentMethod(paymentBankTransfer)
        const bankTransferData: BankTransferModel = {
          bankName: 'PKO Bank',
          accountName: 'Jan Kowalski.123.',
          accountNumber: '1234566789',
        }
        await paymentPage.fillBankData(bankTransferData)
        break

      case 'Cash on Delivery':
        const paymentCashOnDelivery: PaymentModel = {
          method: 'Cash on Delivery',
        }
        await paymentPage.choosePaymentMethod(paymentCashOnDelivery)
        break

      case 'Credit Card':
        const paymentCreditCard: PaymentModel = {
          method: 'Credit Card',
        }
        await paymentPage.choosePaymentMethod(paymentCreditCard)
        const paymentCreditCardData: CreditCardModel = {
          creditCardNumber: '1111-2222-3333-4444',
          expirationDate: '02/2025',
          CVV: '123',
          cardHolderName: 'V',
        }
        await paymentPage.fillCreditCardData(paymentCreditCardData)
        break

      case 'Buy Now Pay Later':
        const paymentBuyNowPayLater: PaymentModel = {
          method: 'Buy Now Pay Later',
        }
        await paymentPage.choosePaymentMethod(paymentBuyNowPayLater)
        const paymentInstallment: BuyNowPayLaterModel = {
          installment: '12 Monthly Installments',
        }
        await paymentPage.chooseBuyNowPayLater(paymentInstallment)
        break

      case 'Gift Card':
        const giftCard: PaymentModel = {
          method: 'Gift Card',
        }
        await paymentPage.choosePaymentMethod(giftCard)
        const paymentGiftCard: GiftCardModel = {
          giftCardNumber: '1234abc',
          validationCode: '4567',
        }
        await paymentPage.fillGiftCard(paymentGiftCard)
        break

      default:
        console.log('❌There is no such payment method')
        break
    }
  }


}
