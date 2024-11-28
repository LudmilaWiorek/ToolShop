import { fixtures as test, expect } from '../fixtures/fixtures.fixture'
import { ApiStore } from '../pages/apiClass.page'

test.describe.parallel('testing payment module', async () => {
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
  test('jakis test', async () => {})
})
