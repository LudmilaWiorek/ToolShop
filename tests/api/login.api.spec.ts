import * as users from '../../JSONS/users.json'
import { expect, fixtures as test } from '../../fixtures/fixtures.fixture'
import { ApiClass } from '../../pages/apiClass.page'

test.describe('testing login module', () => {
  let apiClass: ApiClass
  let header: { Authorization: string }
  test.beforeEach(
    'api login user with correct credentials', // we get a key to gate of the API :)
    async ({ request }) => {
      apiClass = new ApiClass(request)

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
    },
  )
  test('Successful login with valid token', async ({ request }) => {
    // we use that key
    const response = await request.get(`${apiClass.baseUrl}/users/me`, {
      headers: header,
    })

    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    expect(responseBody).toHaveProperty('email')
    expect(responseBody.email).toBe(users.userdata.user[0].email)
  })
  test('Testing endpoint users/me - without token', async ({ request }) => {
    const response = await request.get(`${apiClass.baseUrl}/users/me`)

    expect(response.status()).toBe(401)
    const responseBody = await response.json()
    expect(responseBody.message).toBe('Unauthorized')
  })
  test('Testing endpoint users/me - with invalid token', async ({
    request,
  }) => {
    header = {
      Authorization: 'Bearer fakeToken',
    }
    const response = await request.get(`${apiClass.baseUrl}/users/me`, {
      headers: header,
    })

    expect(response.status()).toBe(401)
    const responseBody = await response.json()
    expect(responseBody.message).toBe('Unauthorized')
  })
})
