import * as users from '../JSONS/users.json'
import type { ApiClass } from '../pages/apiClass.page'
import { apiClassFixture } from './api-class.fixture'

type ApiUserFixture = {
  apiHeader: { Authorization: string }
  apiClass: ApiClass // <-- bo dziedziczysz z apiClassFixture
}

export const apiUserFixture = apiClassFixture.extend<ApiUserFixture>({
  apiHeader: async ({ apiClass, request }, use) => {
    const response = await request.post(`${apiClass.baseUrl}/users/login`, {
      data: {
        email: users.userdata.user[0].email,
        password: users.userdata.user[0].password,
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
