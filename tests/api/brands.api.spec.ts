import { expect, test } from '@playwright/test'

test.describe('Testing Brands API', () => {
  test('get all brands', async ({ request }) => {
    const response = await request.get(
      'https://api.practicesoftwaretesting.com/brands',
    )

    expect(response.status()).toBe(200)

    const responseBody = await response.json()
    // sprawdzamy nei tylko ze jest 200 tylko ze zwrocony obiekt ma trzy wymagane wartosci
    expect(responseBody[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        slug: expect.any(String),
      }),
    )
  })
  test('should throw 404 code for getting non-existing brand', async ({
    request,
  }) => {
    const response = await request.get(
      'https://api.practicesoftwaretesting.com/brands/dfghkgk',
    )
    expect(response.status()).toBe(404)
  })
  test('should throw 405 code when trying to create a brand', async ({
    request,
  }) => {
    const response = await request.get(
      'https://api.practicesoftwaretesting.com/brands?name=something&slug=somethingtoo',
    )
    // expect(response.status()).toBe(405)
    expect(response.status()).toBe(422)
  }) // ? user shouldn't be able to create product, along with Swagger there should be code 405, first it was  201, now 422...
  test('Should successfully store new brand', async ({ request }) => {
    const response = await request.post(
      'https://api.practicesoftwaretesting.com/brands?name=Kraken&slug=Kulineczek',
    )
    expect(response.status()).toBe(201)
  })
})
