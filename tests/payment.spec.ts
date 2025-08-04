import { expect, fixtures as test } from '../fixtures/fixtures.fixture'
import { PaymentMethod, PaymentModel } from '../models/payment.model'
import { ApiClass } from '../pages/apiClass.page'

test.describe.parallel('Testing payment module', () => {
  let apiClass: ApiClass
  test.beforeEach(
    'POST - creating a cart and add some products into it',
    async ({
      request,
      page,
      loginPage,
      accessoryPage,
      deliveryPage,
      paymentPage,
    }) => {
      apiClass = new ApiClass(request)
      // creating cart
      const cartId = await apiClass.prepareCart(3)

      // open browser
      await page.evaluate((cartId) => {
        sessionStorage['cart_id'] = cartId
        sessionStorage['cart_quantity'] = 5
        // because there are 2 parameters in session storage about cart;
        // number is needed just to have possibility to enter the cart
      }, cartId)

      await loginPage.goToPage()
      // open cart
      await accessoryPage.openCart()
      await accessoryPage.confirmCart()
      // confirm login user
      await accessoryPage.confirmLoginData()

      // we need to fill delivery form and we overwrite built in data
      await page.waitForTimeout(2000) // timeout is needed so we can overwrite predefined address
      await deliveryPage.fillDeliveryForm(deliveryPage.billingAddress)
      await deliveryPage.confirmAddress()

      const headerPayment = paymentPage.h3Payment
      await expect(headerPayment).toBeVisible()
    },
  )
  // positive scenarios
  test('successful payment via bank transfer method', async ({
    paymentPage,
  }) => {
    const payment: PaymentModel = {
      method: PaymentMethod.BankTransfer,
      bankTransferModel: {
        bankName: 'PKO Bank',
        accountName: 'Jan Kowalski.123.',
        accountNumber: '1234566789',
      },
    }

    await paymentPage.fillPaymentForm(payment)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })
  test('unsuccessful payment via bank transfer method - incorrect bankName', async ({
    paymentPage,
  }) => {
    const payment: PaymentModel = {
      method: PaymentMethod.BankTransfer,
      bankTransferModel: {
        bankName: '111111111',
        accountName: 'Jan Kowalski.123.',
        accountNumber: '1234566789',
      },
    }
    await paymentPage.fillPaymentForm(payment)
    const incorrectBankNameInput = paymentPage.bankNameAlert

    await expect(incorrectBankNameInput).toHaveText(
      ' Bank name can only contain letters and spaces. ',
    )
    await expect(paymentPage.confirmButton).toBeDisabled()
  })

  test('successful payment via credit card method', async ({ paymentPage }) => {
    const payment: PaymentModel = {
      method: PaymentMethod.CreditCard,
      creditCardModel: {
        creditCardNumber: '1111-2222-3333-4444',
        expirationDate: '10/2025',
        CVV: '123',
        cardHolderName: 'V',
      },
    }
    await paymentPage.fillPaymentForm(payment)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })

  test('successful payment via cash on delivery method', async ({
    paymentPage,
  }) => {
    const payment: PaymentModel = {
      method: PaymentMethod.CashOnDelivery,
    }
    await paymentPage.fillPaymentForm(payment)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })

  test('successful payment via buy now pay later method', async ({
    paymentPage,
  }) => {
    const payment: PaymentModel = {
      method: PaymentMethod.BuyNowPayLater,
      buyNowPayLaterModel: {
        installment: '12 Monthly Installments',
      },
    }
    await paymentPage.fillPaymentForm(payment)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })
  test('successful payment via gift card method', async ({ paymentPage }) => {
    const payment: PaymentModel = {
      method: PaymentMethod.GiftCard,
      giftCardModel: {
        giftCardNumber: '1234abc',
        validationCode: '4567',
      },
    }
    await paymentPage.fillPaymentForm(payment)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })
})
