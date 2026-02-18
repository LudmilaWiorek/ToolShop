import { getProductId } from '../../factory/product-factory'
import { expect, apiUserFixture as test } from '../../fixtures/api-user.fixture'

test.describe('Favorite module tests - API', () => {
  test('Add product to favorites (user logged)', async ({
    request,
    apiHeader,
    apiClass,
  }) => {
    let product_id = await getProductId(request, apiClass.baseUrl)
    const favoriteProductsResponse = await request.get(
      `${apiClass.baseUrl}/favorites`,
      {
        headers: apiHeader,
      },
    )
    expect(favoriteProductsResponse.status()).toBe(200)
    const favoriteProducts = await favoriteProductsResponse.json()

    while (
      favoriteProducts.some(
        (product: { product_id: number }) => product.product_id === product_id,
      )
    ) {
      product_id = await getProductId(request, apiClass.baseUrl)
    }

    const response = await request.post(`${apiClass.baseUrl}/favorites`, {
      data: {
        product_id, // dynamic product ID from JSONS
        // // all good, just have to update ID numbers sometimes.
      },
      headers: apiHeader,
    })

    expect(response.status()).toBe(201)

    const responseBody = await response.json() // potweirdzenie jakie id dalas
    // mistake in documentation Swagger, where is said code should be 200
    const responseFavorites = await request.get(
      `${apiClass.baseUrl}/favorites`,
      { headers: apiHeader },
    )
    const responseBodyFavorites = await responseFavorites.json()
    // console.log(
    //   'RESPONSE FAVORITES:',
    //   JSON.stringify(responseBodyFavorites[0].product.name, null, 2),
    // )

    expect(response.status()).toBe(201)
    // mistake in documentation Swagger, where is said code should be 200

    const listOfFavorites: string[] = []

    responseBodyFavorites.data?.forEach((product: { product_id: number }) => {
      listOfFavorites.push(String(product.product_id))
    })
    expect(listOfFavorites).toContain(responseBody.product_id) // sprawdzamy z tego potweirdzenia czy nasze id ktore dostarczylismy, jest na tej liscie.
  })
})
