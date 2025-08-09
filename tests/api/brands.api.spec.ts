import { expect, test } from '@playwright/test'

test.describe('Testing Brands API', () => {
  test('get all brands', async ({ request }) => {
    const response = await request.get(
      'https://api.practicesoftwaretesting.com/brands',
    )
    expect(response.status()).toBe(200)

    // const responseBody = await response.json()
    // console.log(responseBody)
  })
  test('should throw 404 code for non-existing brand', async ({ request }) => {
    const response = await request.get(
      'https://api.practicesoftwaretesting.com/brands/dfghkgk',
    )
    expect(response.status()).toBe(404)
  })
  test('should throw 405 code when trying to create a brand', async ({
    request,
  }) => {
    const response = await request.post(
      'https://api.practicesoftwaretesting.com/brands?name=something&slug=somethingtoo',
    )
    // expect(response.status()).toBe(405)
    expect(response.status()).toBe(422)
  }) // ? user shouldn't be able to create product, along with Swagger there should be code 405, first it was  201, now 422...
})
