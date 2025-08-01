import { APIRequestContext } from '@playwright/test'

export class ApiClass {
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

  async addItem(
    product_id: string,
    quantity: number,
    cartId: string,
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
      throw `Something is not ok with adding product, statusCode: ${response.status()}, error: ${await response.text()}`
    }
  }

  async getXItems(count: number): Promise<string[]> {
    const response = await this.request.get(`${this.baseUrl}/products/`)
    if (response.status() != 200) throw 'Cannot get items'
    const responseJson = JSON.parse(await response.text())
    count = Math.min(count, responseJson.total) // we care about total number of products

    const ids: string[] = []
    for (let i = 0; i < count; i++) {
      ids.push(responseJson.data[i].id)
    }
    return ids
  }

  async getItemsFromCart(cartId: string): Promise<string> {
    const response = await this.request.get(`${this.baseUrl}/carts/${cartId}`)

    if (response.status() != 200) throw 'Cannot read value in cart!'
    const responseJson = JSON.parse(await response.text())
    return responseJson.cart_items
  }

  async prepareCart(countItems: number): Promise<string> {
    const cartId = await this.createCart()
    // add some product to cart
    const idProducts = await this.getXItems(countItems)

    for (const id of idProducts) {
      const randomNumber = Math.floor(Math.random() * 5) + 1
      await this.addItem(id, randomNumber, cartId)
    }
    return cartId
  }
}
