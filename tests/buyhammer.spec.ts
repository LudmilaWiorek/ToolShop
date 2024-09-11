import { test as baseTest, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { ToolsPage } from '../pages/tools.page'
import { DeliveryPage } from '../pages/delivery.page'
import { AccessoryPage } from '../pages/accessory.page'
import { CartPage } from '../pages/cart.page'
import { lineItem } from '../models/lineItem.model'
import * as users from '../loginData/users.json'
import { billingAddressModel } from '../models/billingAddress.model'

export interface MyFixtures {
  loginPage: LoginPage
  toolsPage: ToolsPage
  deliveryPage: DeliveryPage
  accessoryPage: AccessoryPage
  cartPage: CartPage
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
})

test.describe.parallel('end to end tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    // await loginPage.goToPage()
  })
  test('login with correct credentials', async ({ loginPage, page }) => {
    const dataEmail = users.userdata[0].email
    const dataPass = users.userdata[0].password
    const textMyAccount = 'My account'

    await loginPage.login(dataEmail, dataPass)
    await page.waitForLoadState()
    await expect(loginPage.myAccountTitle).toContainText(textMyAccount)
  })

  test('first end to end test', async ({
    toolsPage,
    deliveryPage,
    accessoryPage,
    cartPage,
    page,
  }) => {
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

    let virtualBasketCount =
      await toolsPage.getItemAmountInArrayCart(arrayProducts)

    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText(
      virtualBasketCount.toString(),
    )

    // Act
    // click on Thor Hammer in related products
    await toolsPage.chooseItem(thorHammerString)
    await accessoryPage.thorHammer.waitFor()

    await accessoryPage.thorHammer.click()
    await page.waitForTimeout(3000)
    // must be 3 sec, with 2 seconds delay test fails!

    //we increase quantity of thor hammers
    await toolsPage.increaseItemCount()
    // add it to cart
    await toolsPage.addToCart(arrayProducts)
    virtualBasketCount = await toolsPage.getItemAmountInArrayCart(arrayProducts)
    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText(
      virtualBasketCount.toString(),
    )

    // Act
    await accessoryPage.logoToolShop.click()
    await page.waitForLoadState()
    // in search input let's write "saw"
    await toolsPage.search('Saw')
    await accessoryPage.saw.waitFor()
    // click on circular saw because it looks cool
    await accessoryPage.saw.click()
    await toolsPage.changeItemAmount(5)
    await toolsPage.addToCart(arrayProducts)
    virtualBasketCount = await toolsPage.getItemAmountInArrayCart(arrayProducts)
    // Assert
    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText(
      virtualBasketCount.toString(),
    )

    // we go to cart page
    await accessoryPage.cartIcon.click()

    //                         ~~CART~~
    // using this loop tells us if this, what we have in our virtual basket
    // equals what we have in cart on the web
    console.log(arrayProducts)
    //for every lineItem we get its name and we compare it with array element
    let sumTotal = 0
    let calculatedSum = 0
    const lineItemLocators = await cartPage.itemLineLocator

    let numberOfLineItems = await cartPage.getItemsAmount()
    for (let i = 0; i < numberOfLineItems; i++) {
      const nameOfProduct = await cartPage.getName(i)
      // we compare result of function with our virtual basket
      await expect(nameOfProduct).toBe(arrayProducts[i].name)

      // for every lineItem we check if quantity is demanded quantity number
      const quantityOfProduct = await cartPage.getQuantity(i)
      await expect(quantityOfProduct).toEqual(arrayProducts[i].quantity)

      //for every line we check price of product
      const priceForProduct = await cartPage.getPrice(i)
      await expect(priceForProduct).toEqual(arrayProducts[i].price)
      // we check if quantity * price = total

      const priceTotalForProduct = await cartPage.getTotal(i)
      const expectedTotalPriceForProduct = quantityOfProduct * priceForProduct
      await expect(priceTotalForProduct).toEqual(expectedTotalPriceForProduct)

      // we sum total cost of shopping
      calculatedSum += priceTotalForProduct
      sumTotal += arrayProducts[i].price * arrayProducts[i].quantity
    }
    const totalSumInCart = (await cartPage.totalSumLocator.innerText()).replace(
      '$',
      '',
    )
    const cartTotal = await cartPage.getCartTotal()
    await expect(cartTotal).toEqual(calculatedSum)

    //Assert
    await expect(totalSumInCart).toEqual(String(sumTotal))
    await expect(lineItemLocators).toHaveCount(3)

    await cartPage.deleteProduct(2, arrayProducts)
    await expect(lineItemLocators).toHaveCount(numberOfLineItems - 1)
    numberOfLineItems = await cartPage.getItemsAmount()

    for (let i = 0; i < numberOfLineItems; i++) {
      const nameOfProduct = await cartPage.getName(i)
      // we compare result of function with our virtual basket
      await expect(nameOfProduct).toBe(arrayProducts[i].name)

      // for every lineItem we check if quantity is demanded quantity number
      const quantityOfProduct = await cartPage.getQuantity(i)
      await expect(quantityOfProduct).toEqual(arrayProducts[i].quantity)

      //for every line we check price of product
      const priceForProduct = await cartPage.getPrice(i)
      await expect(priceForProduct).toEqual(arrayProducts[i].price)
      // we check if quantity * price = total

      const priceTotalForProduct = await cartPage.getTotal(i)
      const expectedTotalPriceForProduct = quantityOfProduct * priceForProduct
      await expect(priceTotalForProduct).toEqual(expectedTotalPriceForProduct)
      calculatedSum += priceTotalForProduct
      sumTotal += arrayProducts[i].price * arrayProducts[i].quantity
    }

    await accessoryPage.successButton.click()

    //                     ~~LOGIN PAGE~~
    // we need to sign in
    await emailInput.fill(dataEmail)
    await passwordInput.fill(dataPass)

    await submitButton.click()

    await expect(accessoryPage.messageYouReLogged).toBeVisible()
    await accessoryPage.proceedButton.click()

    //                  ~~DELIVERY FORM~~
    // we need to fill delivery form and we overwrite built in data
    const billingAddress: billingAddressModel = {
      address: 'Sezamkowa 3/30',
      city: 'Warsaw',
      state: 'mazowieckie',
      country: 'Poland',
      postCode: '03-022',
    }
    await page.waitForLoadState()
    await page.waitForTimeout(2000) // timeout is needed so we can overwrite predefined address
    await deliveryPage.fillDeliveryForm(billingAddress)
    await accessoryPage.billingButton.click()

    const headerPayment = page.locator('//h3[text()="Payment"]')
    // ~~PAYMENT~~
    await expect(headerPayment).toBeVisible()

    const paymentMethod = page.locator('#payment-method')

    await paymentMethod.selectOption('Gift Card')
    const placeholderGiftCardNumber = page.getByPlaceholder('Gift Card Number')
    await expect(placeholderGiftCardNumber).toBeVisible()
  })
})
