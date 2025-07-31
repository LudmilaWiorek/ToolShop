import {
  expect,
  apiAdminFixture as test,
} from '../../fixtures/api-admin.fixture'

test('Mock: DELETE request using page and page.route()', async ({
  page,
  apiClass,
}) => {
  const userId = '01k18ekkea7gtz90dam9yk7bhb'
  const url = `${apiClass.baseUrl}/users/${userId}`

  // piszemy mock
  await page.route(url, async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204, body: '' })
    } else {
      await route.continue()
    }
  })
  //wykorzystujemy mock
  const responseStatus = await page.evaluate(async (url) => {
    const response = await fetch(url, { method: 'DELETE' })
    return response.status
  }, url)

  expect(responseStatus).toBe(204)
})
