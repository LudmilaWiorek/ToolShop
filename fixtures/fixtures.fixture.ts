import * as users from '../JSONS/users.json'
import { AccessoryPage } from '../pages/accessory.page'
import { CartPage } from '../pages/cart.page'
import { DeliveryPage } from '../pages/delivery.page'
import { FavoritePage } from '../pages/favorite.page'
import { LoginPage } from '../pages/login.page'
import { PaymentPage } from '../pages/payment.page'
import { RecoveryPage } from '../pages/recovery.page'
import { RegistrationPage } from '../pages/registration.page'
import { SliderPage } from '../pages/slider.page'
import { ToolsPage } from '../pages/tools.page'
import { test as baseTest } from '@playwright/test'

interface MyFixtures {
  accessoryPage: AccessoryPage
  cartPage: CartPage
  deliveryPage: DeliveryPage
  favoritePage: FavoritePage
  loginPage: LoginPage
  paymentPage: PaymentPage
  recoveryPage: RecoveryPage
  registrationPage: RegistrationPage
  sliderPage: SliderPage
  toolsPage: ToolsPage
}

export const fixtures = baseTest.extend<MyFixtures>({
  accessoryPage: async ({ page }, use) => {
    const accessoryPage = new AccessoryPage(page)
    await use(accessoryPage)
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page)
    await use(cartPage)
  },
  deliveryPage: async ({ page }, use) => {
    const deliveryPage = new DeliveryPage(page)
    await use(deliveryPage)
  },
  favoritePage: async ({ page }, use) => {
    const favouritePage = new FavoritePage(page)
    await use(favouritePage)
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    const dataEmail = users.userdata.user[1].email
    const dataPass = users.userdata.user[1].password
    await loginPage.login(dataEmail, dataPass)
    await page.waitForTimeout(1000)
    await page.waitForLoadState()
    await use(loginPage)
  },
  paymentPage: async ({ page }, use) => {
    const paymentPage = new PaymentPage(page)
    await use(paymentPage)
  },
  recoveryPage: async ({ page }, use) => {
    const recoveryPage = new RecoveryPage(page)
    await use(recoveryPage)
  },
  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page)
    await use(registrationPage)
  },
  sliderPage: async ({ page }, use) => {
    const sliderPage = new SliderPage(page)
    await use(sliderPage)
  },
  toolsPage: async ({ page }, use) => {
    const toolsPage = new ToolsPage(page)
    await use(toolsPage)
  },
})

export { expect } from '@playwright/test'
