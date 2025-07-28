import { ApiClass } from '../../pages/apiClass.page'
import { expect, test } from '@playwright/test'

test.describe('API Search Tests', () => {
  let apiClass: ApiClass
  test('API search for hammer (existing product) with return code 200', async ({
    request,
  }) => {
    apiClass = new ApiClass(request)
    const q = 'hammer'
    const response = await request.get(
      `${apiClass.baseUrl}/products/search?q=${q}`,
      {},
    )
    expect(response.status()).toBe(200)

    const responseBody = JSON.parse(await response.text())
    expect(responseBody.total).toBeGreaterThan(0)

    responseBody.data.forEach((product) => {
      expect(product.name.toLowerCase()).toContain('hammer')
    })
  })

  test('API search for non-existing product with return empty data', async ({
    request,
  }) => {
    apiClass = new ApiClass(request)
    const responseNotFound = await request.get(
      `${apiClass.baseUrl}/products/search`,
      {
        data: { q: 'mouse' },
      },
    )
    expect(responseNotFound.status()).toBe(200)

    const responseBody = JSON.parse(await responseNotFound.text())
    expect(responseBody.total).toBe(0)
  })
})
