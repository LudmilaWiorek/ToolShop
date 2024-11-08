export interface PaymentModel {
  method:
    | 'Bank Transfer'
    | 'Cash on Delivery'
    | 'Credit Card'
    | 'Buy Now Pay Later'
    | 'Gift Card'
  // payment details
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
