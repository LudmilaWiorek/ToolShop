import { test as baseTest } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { ToolsPage } from '../pages/tools.page'
import { DeliveryPage } from '../pages/delivery.page'
import { AccessoryPage } from '../pages/accessory.page'
import { CartPage } from '../pages/cart.page'
import { PaymentPage } from '../pages/payment.page'
import * as users from '../JSONS/users.json'
import { RecoveryPage } from '../pages/recovery.page'

interface MyFixtures {
  loginPage: LoginPage
  toolsPage: ToolsPage
  deliveryPage: DeliveryPage
  accessoryPage: AccessoryPage
  cartPage: CartPage
  paymentPage: PaymentPage
  recoveryPage: RecoveryPage
}

export const fixtures = baseTest.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    const dataEmail = users.userdata[0].email
    const dataPass = users.userdata[0].password
    await loginPage.login(dataEmail, dataPass)
    await page.waitForLoadState()
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
  paymentPage: async ({ page }, use) => {
    const paymentPage = new PaymentPage(page)
    await use(paymentPage)
  },
  recoveryPage: async ({ page }, use) => {
    const recoveryPage = new RecoveryPage(page)
    await use(recoveryPage)
  },
})

export { expect } from '@playwright/test'
