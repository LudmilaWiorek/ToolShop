import {
  expect,
  apiAdminFixtures as test,
} from '../../fixtures/fixtures.fixture'

test('delete user with valid token', async ({
  apiClass,
  apiHeader,
  request,
}) => {
  const responseForAdmin = await request.get(`${apiClass.baseUrl}/users/me`, {
    headers: apiHeader,
  })
  expect(responseForAdmin.status()).toBe(200)
  //at first get userId
  const userId = '01K18EF8V47EW3BW51JS234DEB'
  const response = await request.delete(`${apiClass.baseUrl}/users/${userId}`, {
    headers: apiHeader,
  })

  expect(response.status()).toBe(204)

  await expect(response.text).toBe('')
})
