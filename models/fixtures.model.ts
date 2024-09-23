import { test as baseTest } from '@playwright/test'
import { AccessoryPage } from '../pages/accessory.page'
import { CartPage } from '../pages/cart.page'
import { DeliveryPage } from '../pages/delivery.page'
import { LoginPage } from '../pages/login.page'
import { ToolsPage } from '../pages/tools.page'
import { APIRequestContext } from '@playwright/test'

export interface MyFixtures {
  loginPage: LoginPage
  toolsPage: ToolsPage
  deliveryPage: DeliveryPage
  accessoryPage: AccessoryPage
  cartPage: CartPage
  request: APIRequestContext
}

export const test = baseTest.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage() // ?
    await use(loginPage) // returns loginPage
  },
  toolsPage: async ({ page }, use) => {
    const toolsPage = new ToolsPage(page)
    await use(toolsPage)
  },
  deliveryPage: async ({ page }, use) => {
    const deliveryPage = new DeliveryPage(page)
    await use(deliveryPage)
  },
  accessoryPage: async ({ page }, use) => {
    const accessoryPage = new AccessoryPage(page)
    await use(accessoryPage)
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page)
    await use(cartPage)
  },
  request: async ({APIRequestContext}, use) =>{
    const request = new APIRequestContext(APIRequestContext)
    await use(request)
  }
})
