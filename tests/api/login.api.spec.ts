import * as users from '../../JSONS/users.json'
import { expect, apiUserFixture as test } from '../../fixtures/api-user.fixture'

test.describe('testing login module', () => {
  test('Successful login with valid token', async ({
    request,
    apiClass,
    apiHeader,
  }) => {
    // we use that keyS
    const response = await request.get(`${apiClass.baseUrl}/users/me`, {
      headers: apiHeader,
    })

    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    expect(responseBody).toHaveProperty('email')
    expect(responseBody.email).toBe(users.userdata.user[0].email)
  })

  test('Testing endpoint users/me - without token', async ({
    apiClass,
    request,
  }) => {
    const response = await request.get(`${apiClass.baseUrl}/users/me`)

    expect(response.status()).toBe(401)
    const responseBody = await response.json()
    expect(responseBody).toHaveProperty('message')
    expect(responseBody.message).toBe('Unauthorized')
  })

  test('Testing endpoint users/me - with invalid token', async ({
    apiClass,
    request,
  }) => {
    const header = {
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
