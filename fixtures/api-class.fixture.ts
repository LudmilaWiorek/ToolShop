import { CartApi } from '@api/cart.api'
import { test as base } from '@playwright/test'

export const apiClassFixture = base.extend<{
  apiClass: CartApi
}>({
  apiClass: async ({ request }, use) => {
    const apiClass = new CartApi(request)
    await use(apiClass)
  },
})
export { expect } from '@playwright/test'
