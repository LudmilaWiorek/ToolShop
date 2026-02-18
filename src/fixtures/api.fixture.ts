import { CartApi } from '@api/cart.api'
import { test as base } from '@playwright/test'

export const apiClassFixture = base.extend<{
  apiClass: CartApi
}>({
  apiClass: async ({ request }, use) => {
    const cartApi = new CartApi(request)
    await use(cartApi)
  },
})
export { expect } from '@playwright/test'
