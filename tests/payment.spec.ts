// import { fixtures as test, expect } from '../fixtures/fixtures.fixture'
import { test, expect, APIRequestContext } from '@playwright/test'
import { APIResponse } from '@playwright/test'
import { PaymentPage } from '../pages/payment.page'
import * as users from '../loginData/users.json'

class ApiStore {
  readonly request: APIRequestContext
  readonly baseUrl = 'https://api.practicesoftwaretesting.com'

  constructor(request: APIRequestContext) {
    this.request = request
  }

  async createCart(): Promise<String> {
    const response = await this.request.post(`${this.baseUrl}/carts`)
    if (response.status() != 201) throw 'Cannot create new Cart!'
    const responseJson = JSON.parse(await response.text())
    return responseJson.id
  }

  async loginUser(email: string, password: string): Promise<String> {
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
}
test.describe('testing payment module', () => {
  // before each - create something in cart
  let apiClass: ApiStore
  test('POST - creating a cart and add some products into it', async ({
    request,
  }) => {
    apiClass = new ApiStore(request)
    const dataEmail = users.userdata[0].email
    const dataPass = users.userdata[0].password
    await apiClass.loginUser(dataEmail, dataPass)

    const cartId = await apiClass.createCart()
    console.log(cartId)
  })
})
