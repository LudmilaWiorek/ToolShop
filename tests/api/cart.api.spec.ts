import { expect, fixtures as test } from '@fixtures/api.fixture'

test.describe('Testing api endpoints for cart', () => {
  test('successfully create cart - POST', async ({ request, apiClass }) => {
    const response = await request.post(`${apiClass.baseUrl}/carts`)
    expect(response.status()).toBe(201)
    const responseBody = await response.json()
    expect(responseBody.id).toBeTruthy()
  })
  test('create cart using not allowed method - DELETE', async ({
    request,
    apiClass,
  }) => {
    const response = await request.delete(`${apiClass.baseUrl}/carts`)
    expect(response.status()).toBe(405)
    const responseBody = await response.json()
    await expect(responseBody.message).toBe(
      'Method is not allowed for the requested route',
    )
  })
  test('add item to cart - POST', async ({ request, apiClass }) => {
    let response = await request.post(`${apiClass.baseUrl}/carts`)
    expect(response.status()).toBe(201)
    const responseBody = await response.json()
    const cartId = responseBody.id

    const productIdResponse = await request.get(`${apiClass.baseUrl}/products`)
    const responseJson = await productIdResponse.json()
    const responseProductId = responseJson.data[0].id

    response = await request.post(`${apiClass.baseUrl}/carts/${cartId}`, {
      params: { product_id: responseProductId, quantity: 1 },
    })
    const responseForProduct = await response.json()
    expect(response.status()).toBe(200)
    await expect(responseForProduct.result).toBe('item added or updated')
  })
  test('resource is not found - POST', async ({ request, apiClass }) => {
    let response = await request.post(`${apiClass.baseUrl}/carts`)
    expect(response.status()).toBe(201)
    const cartId = 'invalid'

    const productIdResponse = await request.get(`${apiClass.baseUrl}/products`)
    const responseJson = await productIdResponse.json()
    const responseProductId = responseJson.data[0].id

    response = await request.post(`${apiClass.baseUrl}/carts/${cartId}`, {
      params: { product_id: responseProductId, quantity: 1 },
    })
    expect(response.status()).toBe(404)
    expect(response.statusText()).toBe('Not Found')
  })
})
