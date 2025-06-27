import * as itemNames from '../../JSONS/itemNames.json'
import * as users from '../../JSONS/users.json'
import { expect, fixtures as test } from '../../fixtures/fixtures.fixture'
import { ApiClass } from '../../pages/apiClass.page'

test.describe('testing favorite module', () => {
  let apiClass: ApiClass
  let header: { [key: string]: string }
  test.beforeEach(
    'api login user with correct credentials',
    async ({ request }) => {
      apiClass = new ApiClass(request)
      const response = await request.post(`${apiClass.baseUrl}/users/login`, {
        data: {
          email: users.userdata.user[1].email,
          password: users.userdata.user[1].password,
        },
      })
      const responseBody = JSON.parse(await response.text())
      expect(response.status()).toBe(200)
      expect(responseBody).toHaveProperty('access_token')
      expect(responseBody.access_token).toBeTruthy()

      header = {
        Authorization: `Bearer ${responseBody.access_token}`,
      }
    },
  )
  test('add product to favorites', async ({ request }) => {
    apiClass = new ApiClass(request)
    const response = await request.post(`${apiClass.baseUrl}/favorites`, {
      data: {
        product_id: itemNames.itemName[8].ID, // dynamic product ID from JSONS // all good, just have to update ID numbers sometimes.
      },
      headers: header,
    })

    const responseBody = JSON.parse(await response.text()) // potweirdzenie jakie id dalas
    console.log(responseBody)
    expect(response.status()).toBe(201)
    // mistake in documentation Swagger, where is said code should be 200
    // assert
    const responseFavorites = await request.get(
      // get potrzebuje linka i headera (nagłówka) z tokenem autoryzacji - bo w swaggerze jest kłodeczka.
      `${apiClass.baseUrl}/favorites`,
      { headers: header },
    )
    const responseBodyFavorites = JSON.parse(await responseFavorites.text())
    console.log(responseBodyFavorites)

    expect(response.status()).toBe(201) // gupi swagger ma bledy, powinno byc 200 wg dokumentacji, a jest 201

    const listOfFavorites: string[] = []
    responseBodyFavorites.forEach((product) => {
      listOfFavorites.push(product.product_id)
    })
    console.log('lista', listOfFavorites)
    expect(listOfFavorites).toContain(responseBody.product_id) // sprawdzamy z tego potweirdzenia czy nasze id ktore dostarczylismy, jest na tej liscie.
    // expect(responseBodyFavorites).toHaveProperty('favorites')
  })
})
