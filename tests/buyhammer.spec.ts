import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { ToolsPage } from '../pages/tools.page'
import { DeliveryPage, billingAddressModel } from '../pages/delivery.page'
import { AccessoryPage } from '../pages/accessory.page'
import { CartPage } from '../pages/cart.page'

test.describe.parallel('end to end tests', () => {
  let loginPage: LoginPage
  let toolsPage: ToolsPage
  let deliveryPage: DeliveryPage
  let accessoryPage: AccessoryPage
  let cartPage: CartPage
  test.beforeEach('login test', async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goToPage(page)
    toolsPage = new ToolsPage(page)
    deliveryPage = new DeliveryPage(page)
    accessoryPage = new AccessoryPage(page)
    cartPage = new CartPage(page)
  })
  test('login with correct credentials', async ({ page }) => {
    const dataEmail = 'customer2@practicesoftwaretesting.com'
    const dataPass = 'welcome01'
    const textMyAccount = 'My account'

    await loginPage.login(dataEmail, dataPass)
    await page.waitForLoadState()
    await expect(loginPage.myAccountTitle).toContainText(textMyAccount)
  })

  test('first end to end test', async ({ page }) => {
    // Arrange
    const dataEmail = 'customer2@practicesoftwaretesting.com'
    const dataPass = 'welcome01'
    const emailInput = page.locator('#email')
    const passwordInput = page.locator('#password')
    const submitButton = page.locator('.btnSubmit')

    //create array of products, but push to array is included in addtocart method
    let arrayProducts: string[] = []
    // Act
    // we search for some hammer
    await toolsPage.search('Hammer')
    // click classic claw hammer
    await toolsPage.chooseItem(' Claw Hammer ') // wywalić do konsta!!!
    // add it to cart
    await toolsPage.addToCart(arrayProducts, 'Claw Hammer')
    await page.waitForTimeout(3000)

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('1')

    // Act
    // click on Thor Hammer in related products
    await toolsPage.chooseItem(' Thor Hammer ')
    await accessoryPage.thorHammer.waitFor()
    await accessoryPage.thorHammer.click()
    await page.waitForTimeout(3000) // must be 3 sec, with 2 seconds delay test fails!
    // add it to cart
    await toolsPage.addToCart(arrayProducts, 'Thor Hammer')

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
    await toolsPage.addToCart(arrayProducts, 'Circular Saw')

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('3')

    // we go to checkout
    await accessoryPage.cartIcon.click()

    //CART
    //for every lineItem we get its name and we compare it with array element
    const lineItem = await cartPage.itemName
    for (let i = 0; i < arrayProducts.length; i++) {
      const nameOfProduct0 = await cartPage.getName(lineItem.nth(i))
      await expect(nameOfProduct0).toHaveText(arrayProducts[i])
    }
    //can't put it to method in class because of "expect" inside

    //Assert
    await expect(lineItem).toHaveCount(3)

    //here should be method checking total price of cart (?)

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
