import { PaymentPage } from '../pages/payment.page'
import {
  BankTransferModel,
  BuyNowPayLaterModel,
  CreditCardModel,
  GiftCardModel,
  PaymentModel,
} from '../models/payment.model'

export async function fillPaymentForm(
  paymentPage: PaymentPage,
  paymentMethod: string,
) {
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
