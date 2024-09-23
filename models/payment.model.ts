export interface PaymentModel {
  method:
    | 'Bank Transfer'
    | 'Cash on Delivery'
    | 'Credit Card'
    | 'Buy Now Pay Later'
    | 'Gift Card'
}

export interface BankTransferModel {
  bankName: string
  accountName: string
  accountNumber: string
}

export interface CreditCardModel {
  creditCardNumber: number // specify 16-digit format?
  expirationDate: number // specify date format - MM/YYYY - must be 01-12/YYYY
  CVV: number //3-4 digits
  cardHolderName: string
}

export interface GiftCardModel {
  giftCardNumber: number | string
  validationCode: number
}
