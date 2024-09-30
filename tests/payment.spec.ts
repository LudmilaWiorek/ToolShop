// import { fixtures as test, expect } from '../fixtures/fixtures.fixture'
import { test, expect, APIRequestContext, Page } from '@playwright/test'
import { APIResponse } from '@playwright/test'
import { PaymentPage } from '../pages/payment.page'
import * as users from '../loginData/users.json'
import { ToolsPage } from '../pages/tools.page'
import { AccessoryPage } from '../pages/accessory.page'
import { LoginPage } from '../pages/login.page'

class ApiStore {
  readonly request: APIRequestContext
  readonly baseUrl = 'https://api.practicesoftwaretesting.com'

  constructor(request: APIRequestContext) {
    this.request = request
  }
  // heder w parametrze metody createCart jest wykorzystany w post jako drugi header
  async createCart(headers): Promise<string> {
    const response = await this.request.post(
      `${this.baseUrl}/carts`,
      (headers = headers),
      //pierwszy header jest parametrem do metody post!
      // to jest przepis na wyslanie komendy stworzenia koszyku
      // HEADER to ustawienia do api
      //Api to sa komendy wysylasz cos i cos chcesz

      //komenda jęst request, która wysyla informację, stworz nowy koszyk
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
    }) // wysylam request z zalacznikiem (data, bo zawsze data bedzie zalacznikiem do biblioteki request.post (get rowniez))
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
    // const responseJson = JSON.parse(await response.text())
    // return responseJson.result
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
  let accessoryPage: AccessoryPage
  let loginPage: LoginPage
  test('POST - creating a cart and add some products into it', async ({
    request,
    page,
  }) => {
    //login to account

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
    await apiClass.addItem('01J8FSS96FJNGCX95TNHSNXGSS', 5, cartId, headers)
    await apiClass.addItem('01J8FSS9ED1EEB4P1D0QTJXGX4', 2, cartId, headers)
    await apiClass.addItem('01J8FSS9E7PZMNNB370KY399PB', 2, cartId, headers)

    const cart = await apiClass.checkItemsInCart(cartId)
    console.log(cart)
  })
})
