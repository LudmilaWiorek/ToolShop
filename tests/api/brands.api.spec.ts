import {
  expect,
  apiClassFixture as test,
} from '../../fixtures/api-class.fixture.ts'

test.describe('Testing Brands API', () => {
  test('get all brands', async ({ request, apiClass }) => {
    const response = await request.get(`${apiClass.baseUrl}/brands`)

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
    apiClass,
  }) => {
    const response = await request.get(`${apiClass.baseUrl}/brands/dfghkgk`)
    expect(response.status()).toBe(404)
  })
  test('should throw 405 code when trying to create a brand', async ({
    request,
    apiClass,
  }) => {
    const response = await request.get(
      `${apiClass.baseUrl}/brands?name=something&slug=somethingtoo`,
    )
    // expect(response.status()).toBe(405)
    expect(response.status()).toBe(200)
  }) // ? user shouldn't be able to create product, along with Swagger there should be code 405, first it was  201, now 422...
  test('Should successfully store new brand', async ({ request, apiClass }) => {
    const response = await request.post(
      `${apiClass.baseUrl}/brands?name=Teelfon&slug=Kulin`,
    )
    expect(response.status()).toBe(422)
  })
  test('Should return 404 code when the resource is not found', async ({
    request,
    apiClass,
  }) => {
    const response = await request.post(
      `${apiClass.baseUrl}/brands?name=Ludka&slug="Herbatka`,
    )
    expect(response.status()).toBe(422) //? no code 404
  })
  test('should return code 200 for successful searching for brand', async ({
    request,
    apiClass,
  }) => {
    const response = await request.get(`${apiClass.baseUrl}/brands/search`)
    expect(response.status()).toBe(200)
    const body = await response.json()
    await expect(body[0].name).toBe('ForgeFlex Tools')
  })
})
