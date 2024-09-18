import { lineItem } from '../models/lineItem.model'
import { billingAddressModel } from '../models/billingAddress.model'
import { paymentModel, bankTransferModel } from '../models/payment.model'
import { fixtures as test, expect } from '../fixtures/fixtures.fixture'

// fixture is a test object
test.describe.parallel('end to end tests', () => {
  test.beforeEach(async ({ loginPage }) => {})
  test('login with correct credentials', async ({ loginPage }) => {
    const textMyAccount = 'My account'

    await expect(loginPage.myAccountTitle).toContainText(textMyAccount)
    await loginPage.goToPage()
  })

  test('first end to end test', async ({
    loginPage,
    toolsPage,
    deliveryPage,
    accessoryPage,
    cartPage,
    paymentPage,
    page,
  }) => {
    // Arrange
    const thorHammerString = ' Thor Hammer '
    const clawHammerString = ' Claw Hammer '

    const textMyAccount = 'My account'
    await expect(loginPage.myAccountTitle).toContainText(textMyAccount)

    await loginPage.goToPage()

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
    // click on circular saw
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

    // already signed in
    await accessoryPage.proceedButton.click()

    //                  ~~ DELIVERY FORM ~~
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

    //                ~~ PAYMENT ~~
    const headerPayment = paymentPage.h3Payment
    await expect(headerPayment).toBeVisible()

    const paymentBankTransfer: paymentModel = {
      method: 'Bank Transfer',
    }

    await paymentPage.choosePaymentMethod(paymentBankTransfer)
    const bankTransferData: bankTransferModel = {
      bankName: 'PKO Bank',
      accountName: 'Jan Kowalski.123.',
      accountNumber: '1234566789',
    }
    await paymentPage.validateBankName(bankTransferData.bankName)
    await paymentPage.fillBankData(bankTransferData)
    await expect(paymentPage.bankNameInput).toBeVisible()

    await paymentPage.confirmPayment()
    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
    await paymentPage.confirmPayment()
    await expect(paymentPage.orderSuccessfulMessage).toContainText(
      'Thanks for your order! Your invoice number is ',
    )
    console.log('\x1b[34m', '~~ End-To-End Test Finished ~~') //blue console.log :)
  })
})
