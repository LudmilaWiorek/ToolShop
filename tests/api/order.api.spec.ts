import { CartApi } from '@api/cart.api'
import * as users from '@data/users.json'
import { getProductIdNotInList } from '@factories/product.factory'
import { fixtures as test } from '@fixtures/pages.fixture'
import { expect } from '@playwright/test'

test.describe.serial('testing payment module', () => {
  let apiClass: CartApi
  let header: { Authorization: string }

  test.beforeAll(async ({ request }) => {
    apiClass = new CartApi(request)
    const response = await request.post(`${apiClass.baseUrl}/users/login`, {
      data: {
        email: users.userdata.user[0].email,
        password: users.userdata.user[0].password,
      },
    })
    const responseBody = await response.json()

    expect(responseBody).toHaveProperty('access_token')
    expect(responseBody.access_token).toBeTruthy()
    expect(response.status()).toBe(200)

    header = {
      Authorization: `Bearer ${responseBody.access_token}`,
    }
  })

  test('add product to favorites', async ({ request }) => {
    apiClass = new CartApi(request)

    // Get current favorites to avoid duplicates
    const favoriteProductsResponse = await request.get(
      `${apiClass.baseUrl}/favorites`,
      { headers: header },
    )
    expect(favoriteProductsResponse.status()).toBe(200)
    const favoriteProducts = await favoriteProductsResponse.json()

    // Get a product ID that's not already in favorites
    const existingFavoriteIds = favoriteProducts.map((fav) => fav.product_id)
    const newProductId = await getProductIdNotInList(
      request,
      apiClass.baseUrl,
      existingFavoriteIds,
      20, // Search through 20 products to find one not in favorites
    )

    const response = await request.post(`${apiClass.baseUrl}/favorites`, {
      data: {
        product_id: newProductId,
      },
      headers: header,
    })

    // Should be 201 since we guaranteed it's not already a favorite
    expect(response.status()).toBe(201)

    const responseBody = await response.json()
    expect(responseBody).toBeTruthy()
    expect(responseBody.product_id).toBe(newProductId)
  })
})
