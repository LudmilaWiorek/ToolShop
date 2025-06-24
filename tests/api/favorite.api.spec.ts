import * as itemNames from '../../JSONS/itemNames.json'
import * as users from '../../JSONS/users.json'
import { expect, fixtures as test } from '../../fixtures/fixtures.fixture'
import { ApiClass } from '../../pages/apiClass.page'

test.describe.parallel('testing favorite module', () => {
  let apiClass: ApiClass
  let header: { Authorization: string }
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
      expect(responseBody).toHaveProperty('access_token')
      expect(responseBody.access_token).toBeTruthy()
      expect(response.status()).toBe(200)

      header = {
        Authorization: `Bearer ${responseBody.access_token}`,
      }
    },
  )
  test('add product to favorites', async ({ request }) => {
    apiClass = new ApiClass(request)
    const response = await request.post(`${apiClass.baseUrl}/favorites`, {
      data: {
        product_id: itemNames.itemName[6].ID, // dynamic product ID from JSONS
      },
      headers: header,
    })

    const responseBody = JSON.parse(await response.text())
    expect(response.status()).toBe(201)
  })
})
