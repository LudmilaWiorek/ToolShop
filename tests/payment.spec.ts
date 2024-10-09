import { test } from '@playwright/test'
import * as users from '../loginData/users.json'
import { LoginPage } from '../pages/login.page'
import { ApiStore } from '../pages/apiClass.page'
import { AccessoryPage } from '../pages/accessory.page'

test.describe('testing payment module', async () => {
  let apiClass: ApiStore
  let loginPage: LoginPage
  let accessoryPage: AccessoryPage

  test('POST - creating a cart and add some products into it', async ({
    request,
    page,
  }) => {
    apiClass = new ApiStore(request)
    const dataEmail = users.userdata[0].email
    const dataPass = users.userdata[0].password

    // creating cart
    const cartId = await apiClass.prepareCart() // save result of function to const!!!
    const cart = await apiClass.getItemsFromCart(cartId)

    // open browser
    loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await loginPage.login(dataEmail, dataPass)

    await page.evaluate((cartId) => {
      sessionStorage['cart_id'] = cartId
      sessionStorage['cart_quantity'] = 5 // because there are 2 parameters in session storage about cart; number is needed just to have possibility to enter the cart
    }, cartId)

    // open cart
    accessoryPage = new AccessoryPage(page)
    await accessoryPage.openCart()
  })
})
