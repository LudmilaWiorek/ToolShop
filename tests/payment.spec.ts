import { test, APIRequestContext, Page } from '@playwright/test'
import * as users from '../loginData/users.json'
import { LoginPage } from '../pages/login.page'

class ApiStore {
  readonly request: APIRequestContext
  readonly baseUrl = 'https://api.practicesoftwaretesting.com'

  constructor(request: APIRequestContext) {
    this.request = request
  }
  async createCart(headers): Promise<string> {
    const response = await this.request.post(
      `${this.baseUrl}/carts`,
      (headers = headers),
    )
    if (response.status() != 201) throw 'Cannot create new Cart!'
    const responseJson = JSON.parse(await response.text())
    return responseJson.id
  }

  async loginUser(email: string, password: string): Promise<string> {
    const loginData = {
      email: email,
      password: password,
    }
    const response = await this.request.post(`${this.baseUrl}/users/login`, {
      data: loginData,
    })
    if (response.status() != 200) throw 'Cannot log in!'
    const responseJson = JSON.parse(await response.text())
    return responseJson.access_token
  }

  async addItem(
    product_id: string,
    quantity: number,
    cartId: string,
    headers,
  ): Promise<void> {
    const productData = {
      product_id: product_id,
      quantity: quantity,
    }
    console.log('CART_ID', cartId)
    const response = await this.request.post(
      `${this.baseUrl}/carts/${cartId}`,
      { headers: headers, data: productData },
    )

    if (response.status() != 200) {
      console.log('RESPONSE STATUS', response.status())
      console.log('response', await response.text())
      throw 'Something is not ok with adding product'
    }
  }

  async checkItemsInCart(cartId: string): Promise<string> {
    const response = await this.request.get(`${this.baseUrl}/carts/${cartId}`)

    if (response.status() != 200) throw 'Cannot read value in cart!'
    const responseJson = JSON.parse(await response.text())
    return responseJson.cart_items
  }
}
test.describe('testing payment module', () => {
  let apiClass: ApiStore
  let loginPage: LoginPage
  test('POST - creating a cart and add some products into it', async ({
    request,
    page,
  }) => {
    // login to account by API
    apiClass = new ApiStore(request)
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
    await apiClass.addItem('01J9M273KYN3GXCV5C2AV7J5H3', 5, cartId, headers)
    await apiClass.addItem('01J9M273GMJEA187833XZK3ZKH', 2, cartId, headers)
    await apiClass.addItem('01J9M273S89Q4ZY4DE97DZ2MFN', 2, cartId, headers)

    const cart = await apiClass.checkItemsInCart(cartId)
    console.log(cart)

    // open browser
    loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await loginPage.login(dataEmail, dataPass)
    console.log('CARTID', cartId)
    await page.evaluate((cartId) => {
      sessionStorage['cart_id'] = cartId
      sessionStorage['cart_quantity'] = 5 // because there are 2 parameters in session storage about cart; number is needed just to have possibility to enter the cart
    }, cartId)
  })
})
