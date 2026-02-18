import * as users from '@data/users.json'
import { LoginPage } from '@pages/authentication/login.page'
import { RecoveryPage } from '@pages/authentication/recovery.page'
import { RegistrationPage } from '@pages/authentication/registration.page'
import { AccessoryPage } from '@pages/catalog/accessory.page'
import { ProductPage } from '@pages/catalog/product.page'
import { SearchPage } from '@pages/catalog/search.page'
import { SliderPage } from '@pages/catalog/slider.page'
import { SortDropdownPage } from '@pages/catalog/sort.page'
import { ToolsPage } from '@pages/catalog/tools.page'
import { CartPage } from '@pages/shopping/cart.page'
import { DeliveryPage } from '@pages/shopping/delivery.page'
import { FavoritePage } from '@pages/shopping/favorite.page'
import { PaymentPage } from '@pages/shopping/payment.page'
import { test as baseTest } from '@playwright/test'

interface MyFixtures {
  accessoryPage: AccessoryPage
  cartPage: CartPage
  deliveryPage: DeliveryPage
  favoritePage: FavoritePage
  loginPage: LoginPage
  paymentPage: PaymentPage
  productPage: ProductPage
  recoveryPage: RecoveryPage
  registrationPage: RegistrationPage
  searchPage: SearchPage
  sliderPage: SliderPage
  sortDropdownPage: SortDropdownPage
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
    await page.waitForTimeout(5000)
    const dataEmail = users.userdata.user[1].email
    const dataPass = users.userdata.user[1].password
    await loginPage.login(dataEmail, dataPass)
    await page.waitForLoadState()
    // await loginPage.myAccountTitle.waitFor()

    await use(loginPage)
  },
  paymentPage: async ({ page }, use) => {
    const paymentPage = new PaymentPage(page)
    await use(paymentPage)
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page)
    await use(productPage)
  },
  recoveryPage: async ({ page }, use) => {
    const recoveryPage = new RecoveryPage(page)
    await use(recoveryPage)
  },
  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page)
    await use(registrationPage)
  },
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page)
    await searchPage.goto('/')
    await use(searchPage)
  },
  sliderPage: async ({ page }, use) => {
    const sliderPage = new SliderPage(page)
    await sliderPage.page.goto('/')
    await use(sliderPage)
  },
  sortDropdownPage: async ({ page }, use) => {
    const sortPage = new SortDropdownPage(page)
    await sortPage.page.goto('/')
    await use(sortPage)
  },
  toolsPage: async ({ page }, use) => {
    const toolsPage = new ToolsPage(page)
    await use(toolsPage)
  },
})

export { expect } from '@playwright/test'
