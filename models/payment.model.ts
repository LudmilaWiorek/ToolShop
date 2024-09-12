export interface paymentModel {
  method:
    | 'Bank Transfer'
    | 'Cash on Delivery'
    | 'Credit Card'
    | 'Buy Now Pay Later'
    | 'Gift Card'
}

export interface bankTransferModel {
  bankName: string
  accountName: string | number
  accountNumber: number
}

export interface creditCardModel {
  creditCardNumber: number // specify 16-digit format?
  expirationDate: number // specify date format - MM/YYYY - must be 01-12/YYYY
  CVV: number //3-4 digits
  cardHolderName: string
}

export interface giftCardModel {
  giftCardNumber: number | string
  validationCode: number
}
