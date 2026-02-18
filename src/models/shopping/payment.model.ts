export enum PaymentMethod {
  BankTransfer = 'Bank Transfer',
  CashOnDelivery = 'Cash on Delivery',
  CreditCard = 'Credit Card',
  BuyNowPayLater = 'Buy Now Pay Later',
  GiftCard = 'Gift Card',
}

export interface PaymentModel {
  method: string
  bankTransferModel?: BankTransferModel
  creditCardModel?: CreditCardModel
  buyNowPayLaterModel?: BuyNowPayLaterModel
  giftCardModel?: GiftCardModel
}

export interface BankTransferModel {
  bankName: string
  accountName: string
  accountNumber: string
}

export interface CreditCardModel {
  creditCardNumber: string
  expirationDate: string
  CVV: string
  cardHolderName: string
}

// TODO: refactor to enum
export interface BuyNowPayLaterModel {
  installment:
    | '3 Monthly Installments'
    | '6 Monthly Installments'
    | '9 Monthly Installments'
    | '12 Monthly Installments'
}
export interface GiftCardModel {
  giftCardNumber: string
  validationCode: string
}
