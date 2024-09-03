import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { ToolsPage } from '../pages/tools.page'
import { DeliveryPage, billingAddressModel } from '../pages/delivery.page'
import { AccessoryPage } from '../pages/accessory.page'
import { CartPage } from '../pages/cart.page'
import { lineItem } from '../models/lineItem.model'
import * as users from '../loginData/users.json'

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
    const dataEmail = users.userdata[0].email
    const dataPass = users.userdata[0].password
    const textMyAccount = 'My account'

    await loginPage.login(dataEmail, dataPass)
    await page.waitForLoadState()
    await expect(loginPage.myAccountTitle).toContainText(textMyAccount)
  })

  test('first end to end test', async ({ page }) => {
    // Arrange
    const dataEmail = users.userdata[0].email
    const dataPass = users.userdata[0].password
    const emailInput = page.locator('#email')
    const passwordInput = page.locator('#password')
    const submitButton = page.locator('.btnSubmit')
    const thorHammerString = ' Thor Hammer '
    const clawHammerString = ' Claw Hammer '

    //create array of products, but push to array is included in addToCart method in toolsPage
    let arrayProducts: lineItem[] = []

    // Act
    // we search for some hammer
    await toolsPage.search('Hammer')
    // click classic claw hammer
    await toolsPage.chooseItem(clawHammerString)
    // add it to cart
    await toolsPage.addToCart(arrayProducts)
    await page.waitForTimeout(3000)

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText('1')

    // Act
    // click on Thor Hammer in related products
    await toolsPage.chooseItem(thorHammerString)
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

    //                         ~~CART~~
    // using this loop tells us if this, what we have in our virtual basket
    // equals what we have in cart on the web
    console.log(arrayProducts)
    //for every lineItem we get its name and we compare it with array element
    let sumTotal = 0
    const lineItemLocators = await cartPage.itemNameLocator

    const numberOfLineItems = await cartPage.getItemsAmount()
    console.log('NUMBER OF LINE ITEMS', numberOfLineItems)
    for (let i = 0; i < numberOfLineItems; i++) {
      const nameOfProduct = await cartPage.getName(i)
      // we compare result of function with our virtual basket
      await expect(nameOfProduct).toBe(arrayProducts[i].name)

      // for every lineItem we check if quantity is demanded quantity number
      const quantityOfProduct = await cartPage.getQuantity(i)
      await expect(quantityOfProduct).toEqual(arrayProducts[i].quantity)

      //for every line we check price of product
      const priceForProduct = await cartPage.getPrice(lineItemLocators.nth(i))
      await expect(priceForProduct).toContainText(arrayProducts[i].price)
      // we check if quantity * price = total
      
      // CHECK TOTAL COMMENTED
      // const checkedTotal = await cartPage.checkTotal(lineItemLocators.nth(i))
      // await expect(checkedTotal).toBeTruthy()

      // we sum total cost of shopping
      sumTotal +=
        Number.parseFloat(arrayProducts[i].price) * arrayProducts[i].quantity
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

    const headerPayment = page.locator('//h3[text()="Payment"]')
    //we are on payment module
    await expect(headerPayment).toBeVisible()

    const paymentMethod = page.locator('#payment-method')

    await paymentMethod.selectOption('Gift Card')
    const placeholderGiftCardNumber = page.getByPlaceholder('Gift Card Number')
    await expect(placeholderGiftCardNumber).toBeVisible()
  })
})
