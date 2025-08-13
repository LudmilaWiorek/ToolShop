import {
  expect,
  apiClassFixture as test,
} from '../../fixtures/api-class.fixture.ts'

test.describe('Testing api endpoints for cart', () => {
  test('post cart', async ({ request, apiClass }) => {
    const response = await request.post(`${apiClass.baseUrl}/carts`)
    expect(response.status()).toBe(201)
    const responseBody = await response.json()
    expect(responseBody.id).toBeTruthy()
  })
})
