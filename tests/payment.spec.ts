import { expect, fixtures as test } from '../fixtures/fixtures.fixture'
import { PaymentModel } from '../models/payment.model'
import { ApiStore } from '../pages/apiClass.page'

test.describe.parallel('testing payment module', () => {
  let apiClass: ApiStore
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
      apiClass = new ApiStore(request)

      // creating cart
      const cartId = await apiClass.prepareCart(3)

      // open browser
      await page.evaluate((cartId) => {
        sessionStorage['cart_id'] = cartId
        sessionStorage['cart_quantity'] = 5
        // because there are 2 parameters in session storage about cart; number is needed just to have possibility to enter the cart
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
  test('testing bank transfer module', async ({ paymentPage }) => {
    const payment: PaymentModel = {
      method: 'Bank Transfer',
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
  test('testing bank transfer module - incorrect bankName', async ({
    paymentPage,
  }) => {
    const payment: PaymentModel = {
      method: 'Bank Transfer',
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

  test('testing credit card module', async ({ paymentPage }) => {
    const payment: PaymentModel = {
      method: 'Credit Card',
      creditCardModel: {
        creditCardNumber: '1111-2222-3333-4444',
        expirationDate: '02/2025',
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

  test('testing cash on delivery module', async ({ paymentPage }) => {
    const payment: PaymentModel = {
      method: 'Cash on Delivery',
    }
    await paymentPage.fillPaymentForm(payment)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })

  test('testing buy now pay later module', async ({ paymentPage }) => {
    const payment: PaymentModel = {
      method: 'Buy Now Pay Later',
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
  test('testing gift card module', async ({ paymentPage }) => {
    const payment: PaymentModel = {
      method: 'Gift Card',
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
