import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { ToolsPage } from '../pages/tools.page'
import { DeliveryPage, billingAddressModel } from '../pages/delivery.page'
import { AccessoryPage } from '../pages/accessory.page'
import { CartPage } from '../pages/cart.page'
import { lineItem } from '../models/lineItem.model'

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

    //create array of products, but push to array is included in addToCart method in toolsPage
    let arrayProducts: lineItem[] = []

    // Act
    // we search for some hammer
    await toolsPage.search('Hammer')
    // click classic claw hammer
    await toolsPage.chooseItem(' Claw Hammer ') // wywalić do konsta!!!
    // add it to cart
    await toolsPage.addToCart(arrayProducts)
    await page.waitForTimeout(3000)

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('1')

    // Act
    // click on Thor Hammer in related products
    await toolsPage.chooseItem(' Thor Hammer ')
    await accessoryPage.thorHammer.waitFor()

    await accessoryPage.thorHammer.click()
    await page.waitForTimeout(3000)
    // must be 3 sec, with 2 seconds delay test fails!
    //we increase quantity of thor hammers
    await toolsPage.increaseButton.click()
    // add it to cart
    await toolsPage.addToCart(arrayProducts)

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('3')

    // Act
    // click on Tool Shop Logo in order to go to main page
    await accessoryPage.logoToolShop.click()
    await page.waitForLoadState()
    // in search input let's write "saw"
    await toolsPage.search('Saw')
    await accessoryPage.saw.waitFor()
    // click on circular saw because it looks cool
    await accessoryPage.saw.click()
    await toolsPage.addToCart(arrayProducts)

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('4')

    // we go to checkout
    await accessoryPage.cartIcon.click()

    // ~~CART~~
    //using this loop tells us if this, what we have in our virtual basket
    // equals what we have in cart on the web
    console.log(arrayProducts)
    //for every lineItem we get its name and we compare it with array element
    let sumTotal = 0
    const lineItemLocators = await cartPage.itemName
    for (let i = 0; i < arrayProducts.length; i++) {
      const nameOfProduct = await cartPage.getName(lineItemLocators.nth(i))
      await expect(nameOfProduct).toHaveText(arrayProducts[i].name)
      // for every lineItem we check if quantity is demanded quantity number
      const quantityOfProduct = await cartPage.getQuantity(
        lineItemLocators.nth(i),
      )
      await expect(quantityOfProduct).toHaveValue(arrayProducts[i].quantity)
      //for every line we check price of product
      const priceForProduct = await cartPage.getPrice(lineItemLocators.nth(i))
      await expect(priceForProduct).toContainText(arrayProducts[i].price)
      // we check if quantity * price = total
      const checkedTotal = await cartPage.checkTotal(lineItemLocators.nth(i))
      await expect(checkedTotal).toBeTruthy()

      // we sum total cost of shopping
      sumTotal +=
        Number.parseFloat(arrayProducts[i].price) *
        Number.parseInt(arrayProducts[i].quantity)
    }
    console.log(sumTotal)
    const totalSumInCart = (await cartPage.totalSumLocator.innerText()).replace(
      '$',
      '',
    )

    //Assert
    await expect(totalSumInCart).toEqual(String(sumTotal))

    await expect(lineItemLocators).toHaveCount(3)

    await accessoryPage.successButton.click()

    // we need to sign in
    await emailInput.fill(dataEmail)
    await passwordInput.fill(dataPass)

    await submitButton.click()

    await expect(accessoryPage.messageYouReLogged).toBeVisible()
    await accessoryPage.proceedButton.click()

    // we need to fill delivery formular and we overwrite built in data
    const billingAddress: billingAddressModel = {
      address: 'Sezamkowa 3/30',
      city: 'Warsaw',
      state: 'mazowieckie',
      country: 'Poland',
      postCode: '03-022',
    }
    await page.waitForLoadState()
    await page.waitForTimeout(2000) // timeout is needed so we can overwrite predefined address
    await deliveryPage.fillDeliveryFormular(billingAddress)
    await accessoryPage.billingButton.click()
  })
})
