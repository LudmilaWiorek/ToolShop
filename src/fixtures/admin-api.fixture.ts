import { apiClassFixture } from './api.fixture'
import type { CartApi } from '@api/cart.api'
import * as users from '@data/users.json'

type ApiAdminFixture = {
  apiHeader: { Authorization: string }
  apiClass: CartApi // <-- because you inherit from apiClassFixture
}

export const apiAdminFixture = apiClassFixture.extend<ApiAdminFixture>({
  apiHeader: async ({ apiClass, request }, use) => {
    const response = await request.post(`${apiClass.baseUrl}/users/login`, {
      data: {
        email: users.userdata.admin[0].email,
        password: users.userdata.admin[0].password,
      },
    })
    const responseBody = await response.json()
    const header = {
      Authorization: `Bearer ${responseBody.access_token}`,
    }
    await use(header)
  },
})
export { expect } from '@playwright/test'
