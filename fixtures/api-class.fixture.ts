import { ApiClass } from '../pages/apiClass.page'
import { test as base } from '@playwright/test'

export const apiClassFixture = base.extend<{
  apiClass: ApiClass
}>({
  apiClass: async ({ request }, use) => {
    const apiClass = new ApiClass(request)
    await use(apiClass)
  },
})
export { expect } from '@playwright/test'
