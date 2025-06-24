import * as users from '../../JSONS/users.json'
import { expect, fixtures as test } from '../../fixtures/fixtures.fixture'
import { ApiStore } from '../../pages/apiClass.page'

test.describe('testing login module', () => {
  let apiClass: ApiStore
  test('api login user with correct credentials', async ({ request }) => {
    apiClass = new ApiStore(request)
    const response = await request.post(`${apiClass.baseUrl}/users/login`, {
      data: {
        email: users.userdata.user[0].email,
        password: users.userdata.user[0].password,
      },
    })
    const responseBody = JSON.parse(await response.text())

    expect(responseBody).toHaveProperty('access_token')
    expect(responseBody.access_token).toBeTruthy()
    expect(response.status()).toBe(200)
  })
})
