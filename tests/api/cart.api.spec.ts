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
})
