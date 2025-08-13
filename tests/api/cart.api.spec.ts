import {
  expect,
  apiClassFixture as test,
} from '../../fixtures/api-class.fixture.ts'

test.describe('Testing api endpoints for cart', () => {
  test('successfully create cart', async ({ request, apiClass }) => {
    const response = await request.post(`${apiClass.baseUrl}/carts`)
    expect(response.status()).toBe(201)
    const responseBody = await response.json()
    expect(responseBody.id).toBeTruthy()
  })
  test('create cart using not allowed method', async ({
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
  test('add item to cart', async ({ request, apiClass }) => {
    let response = await request.post(`${apiClass.baseUrl}/carts`)
    expect(response.status()).toBe(201)
    const responseBody = await response.json()
    const cartId = responseBody.id

    const productIdResponse = await request.get(`${apiClass.baseUrl}/products`)
    const responseProductId = (await productIdResponse.json()).data[0].id

    response = await request.post(`${apiClass.baseUrl}/carts/${cartId}`, {
      params: { product_id: responseProductId, quantity: 1 },
    })
  })
})
