import { APIRequestContext } from '@playwright/test'

export class ApiStore {
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
