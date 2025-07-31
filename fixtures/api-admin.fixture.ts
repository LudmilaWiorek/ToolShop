import * as users from '../JSONS/users.json'
import type { ApiClass } from '../pages/apiClass.page'
import { apiClassFixture } from './api-class.fixture'

type ApiAdminFixture = {
  apiHeader: { Authorization: string }
  apiClass: ApiClass // <-- bo dziedziczysz z apiClassFixture
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
    console.log('[FIXTURE] Admin token:', header)
    await use(header)
  },
})
export { expect } from '@playwright/test'
