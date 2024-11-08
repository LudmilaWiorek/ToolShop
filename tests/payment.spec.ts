import { test, expect } from '@playwright/test'
import * as users from '../loginData/users.json'
import { LoginPage } from '../pages/login.page'
import { ApiStore } from '../pages/apiClass.page'
import { AccessoryPage } from '../pages/accessory.page'
import { DeliveryPage } from '../pages/delivery.page'
import { PaymentPage } from '../pages/payment.page'
import { PaymentModel } from '../models/payment.model'

test.describe.parallel('testing payment module', async () => {
  let apiClass: ApiStore
  let loginPage: LoginPage
  let accessoryPage: AccessoryPage
  let deliveryPage: DeliveryPage
  let paymentPage: PaymentPage

  test.beforeEach(
    'POST - creating a cart and add some products into it',
    async ({ request, page }) => {
      apiClass = new ApiStore(request)
      const dataEmail = users.userdata[0].email
      const dataPass = users.userdata[0].password

      // creating cart
      const cartId = await apiClass.prepareCart(3)

      // open browser
      loginPage = new LoginPage(page)
      await loginPage.goToPage()
      await loginPage.login(dataEmail, dataPass)

      await page.evaluate((cartId) => {
        sessionStorage['cart_id'] = cartId
        sessionStorage['cart_quantity'] = 5
        // because there are 2 parameters in session storage about cart; number is needed just to have possibility to enter the cart
      }, cartId)

      // open cart
      accessoryPage = new AccessoryPage(page)
      await accessoryPage.openCart()

      await accessoryPage.confirmCart()
      // confirm login user
      await accessoryPage.confirmLoginData()

      deliveryPage = new DeliveryPage(page)
      // we need to fill delivery form and we overwrite built in data
      await page.waitForTimeout(2000) // timeout is needed so we can overwrite predefined address
      await deliveryPage.fillDeliveryForm(deliveryPage.billingAddress)
      await deliveryPage.confirmAddress()

      paymentPage = new PaymentPage(page)
      const headerPayment = paymentPage.h3Payment
      await expect(headerPayment).toBeVisible()
    },
  )
  // positive scenarios
  test('testing bank transfer module', async () => {
    const payment: PaymentModel = {
      method: 'Bank Transfer',
    }
    await paymentPage.fillPaymentForm(payment.method)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })

  test('testing cash on delivery module', async () => {
    const payment: PaymentModel = {
      method: 'Cash on Delivery',
    }
    await paymentPage.fillPaymentForm(payment.method)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })
  test('testing buy now pay later module', async () => {
    const payment: PaymentModel = {
      method: 'Buy Now Pay Later',
    }
    await paymentPage.fillPaymentForm(payment.method)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })
  test('testing gift card module', async () => {
    const payment: PaymentModel = {
      method: 'Gift Card',
    }
    await paymentPage.fillPaymentForm(payment.method)
    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
  })
})
