import { APIRequestContext } from '@playwright/test'

export class ApiStore {
  readonly request: APIRequestContext
  readonly baseUrl = 'https://api.practicesoftwaretesting.com'

  constructor(request: APIRequestContext) {
    this.request = request
  }
  async createCart(): Promise<string> {
    const response = await this.request.post(`${this.baseUrl}/carts`)
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
    // headers,
  ): Promise<void> {
    const productData = {
      product_id: product_id,
      quantity: quantity,
    }
    const response = await this.request.post(
      `${this.baseUrl}/carts/${cartId}`,
      { data: productData },
    )

    if (response.status() != 200) {
      throw 'Something is not ok with adding product'
    }
  }

  async getItemsFromCart(cartId: string): Promise<string> {
    const response = await this.request.get(`${this.baseUrl}/carts/${cartId}`)

    if (response.status() != 200) throw 'Cannot read value in cart!'
    const responseJson = JSON.parse(await response.text())
    return responseJson.cart_items
  }

  async prepareCart(): Promise<string> {
    const cartId = await this.createCart()
    // add some product to cart
    // CAREFUL sometimes id products changing and are needed to manual update!
    await this.addItem('01J9REZFFNWC5BD5ET23ESCTT2', 5, cartId)
    return cartId
  }
}
