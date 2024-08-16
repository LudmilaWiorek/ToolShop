import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { ToolsPage } from '../pages/tools.page'
import { DeliveryPage, billingAddressModel } from '../pages/delivery.page'
import { AccessoryPage } from '../pages/accessory.page'

test.describe.parallel('end to end tests', () => {
  let loginPage: LoginPage
  let toolsPage: ToolsPage
  let deliveryPage: DeliveryPage
  let accessoryPage: AccessoryPage
  test.beforeEach('login test', async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goToPage(page)
    toolsPage = new ToolsPage(page)
    deliveryPage = new DeliveryPage(page)
    accessoryPage = new AccessoryPage(page)
  })
  test('login with correct credentials', async ({ page }) => {
    const dataEmail = 'customer2@practicesoftwaretesting.com'
    const dataPass = 'welcome01'
    // const pageTitle = page.locator('[data-test="page-title"]')
    const textMyAccount = 'My account'

    await loginPage.login(dataEmail, dataPass)
    await page.waitForLoadState()
    await expect(accessoryPage.pageTitle).toContainText(textMyAccount)
  })

  test('first end to end test', async ({ page }) => {
    // Arrange
    const dataEmail = 'customer2@practicesoftwaretesting.com'
    const dataPass = 'welcome01'
    const emailInput = page.locator('#email')
    const passwordInput = page.locator('#password')
    const submitButton = page.locator('.btnSubmit')

    // Act
    // we search for some hammer
    await toolsPage.search('Hammer')
    // click classic claw hammer
    await toolsPage.chooseItem(' Claw Hammer ') // wywalić do konsta!!!
    // add it to cart
    await toolsPage.addToCart()
    await page.waitForTimeout(3000) // czekamy 3sec

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('1')

    // Act
    // click on Thor Hammer in related products
    await toolsPage.chooseItem(' Thor Hammer ')
    await accessoryPage.thorHammer.waitFor()
    await accessoryPage.thorHammer.click()
    // add it to cart
    await toolsPage.addToCart()
    await page.waitForTimeout(3000)

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('2')

    // Act
    // click on Tool Shop Logo in order to go to main page
    await accessoryPage.logoToolShop.click()
    await page.waitForLoadState()
    // in search input let's write "saw"
    await toolsPage.search('Saw')
    await accessoryPage.saw.waitFor()
    // click on circular saw because it looks cool
    await accessoryPage.saw.click()
    await toolsPage.addToCart()

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('3')

    // we go to checkout
    await accessoryPage.cartIcon.click()

    // Assert
    // we check if all items are in the cart

    // await expect(productName.nth(0)).toHaveText('Claw Hammer')
    // await expect(productName.nth(1)).toHaveText('Thor Hammer')
    // await expect(productName.nth(2)).toHaveText('Circular Saw')
    // await expect(productName).toHaveCount(3)

    //here should be method checking total price of cart (?)

    // await accessoryPage.proceedButton.click()
    await accessoryPage.successButton.click()

    // we need to sign in
    await emailInput.fill(dataEmail)
    await passwordInput.fill(dataPass)

    await submitButton.click()
    //? or we don't because it says we are already logged in

    await expect(accessoryPage.messageYouReLogged).toBeVisible()
    // await page.pause()
    await accessoryPage.proceedButton.click()

    // we need to fill delivery formular

    const billingAddress: billingAddressModel = {
      address: 'Sezamkowa 3/30',
      city: 'Warsaw',
      state: 'mazowieckie',
      country: 'Poland',
      postCode: '03-022',
    }
    await page.waitForLoadState()
    await deliveryPage.fillDeliveryFormular(billingAddress)
  })
})
