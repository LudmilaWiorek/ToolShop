import { APIRequestContext, Page } from '@playwright/test'
import { ApiStore } from '../pages/apiClass.page'
import { LoginPage } from '../pages/login.page'
import * as users from '../loginData/users.json'
import * as products from '../products/products.json'

export async function prepareCartUsingAPI(
  request: APIRequestContext,
  page: Page,
) {
  let apiClass = new ApiStore(request)
  const dataEmail = users.userdata[0].email
  const dataPass = users.userdata[0].password
  const token = await apiClass.loginUser(dataEmail, dataPass)
  const headers = {
    authorization: `Bearer ${token}`,
  }
  console.log('token', token)
  // creating cart
  const cartId = await apiClass.createCart(headers)
  console.log(cartId)
  // add some product to cart
  // CAREFUL sometimes id products changing and are needed to manual update!
  await apiClass.addItem('01J9M5N0NNF4RA09GYDVT1KKCJ', 5, cartId, headers)
  await apiClass.addItem('01J9M5N0NPYCHSC0A4V7HEMZWD', 2, cartId, headers)
  await apiClass.addItem('01J9M5N0NMJXJTWZEMECEY0YP5', 2, cartId, headers)

  const cart = await apiClass.checkItemsInCart(cartId)
  console.log(cart)

  // open browser
  let loginPage = new LoginPage(page)
  await loginPage.goToPage()
  await loginPage.login(dataEmail, dataPass)

  console.log('CARTID', cartId)

  await page.evaluate((cartId) => {
    sessionStorage['cart_id'] = cartId
    sessionStorage['cart_quantity'] = 5 // because there are 2 parameters in session storage about cart; number is needed just to have possibility to enter the cart
  }, cartId)
}
