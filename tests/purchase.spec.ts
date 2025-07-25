import { expect, fixtures as test } from '../fixtures/fixtures.fixture'
import { LineItem } from '../models/lineItem.model'
import { PaymentModel } from '../models/payment.model'

test.describe.parallel('end to end tests', () => {
  test.beforeEach('login with correct credentials', async ({ loginPage }) => {
    const arrayUrl = await loginPage.page.url().split('/')
    const lastArrayElement = await arrayUrl[arrayUrl.length - 1]
    if (lastArrayElement !== 'account') {
      throw 'login failed'
    }
    await loginPage.goToPage()
  })

  test('purchasing test', async ({
    toolsPage,
    deliveryPage,
    accessoryPage,
    cartPage,
    paymentPage,
    page,
  }) => {
    const thorHammerString = ' Thor Hammer '
    const clawHammerString = ' Claw Hammer '

    // create array of products, but push to array is included in addToCart method in toolsPage
    const arrayProducts: LineItem[] = []

    await toolsPage.search('Hammer')
    await toolsPage.chooseItem(clawHammerString)
    await toolsPage.increaseItemCount()
    await toolsPage.addToCart(arrayProducts)

    let virtualBasketCount =
      await toolsPage.getItemAmountInArrayCart(arrayProducts)

    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText(
      virtualBasketCount.toString(),
    )

    await toolsPage.chooseItem(thorHammerString)
    await accessoryPage.thorHammer.waitFor()

    await expect(toolsPage.quantity).toHaveValue('2')

    await accessoryPage.thorHammer.click()
    await page.waitForTimeout(3000)
    // must be 3 sec, with 2 seconds delay test fails!

    await toolsPage.decreaseItemCount()
    await toolsPage.addToCart(arrayProducts)
    virtualBasketCount = await toolsPage.getItemAmountInArrayCart(arrayProducts)

    await expect(accessoryPage.cartCount).toHaveText(
      virtualBasketCount.toString(),
    )

    await accessoryPage.logoToolShop.click()
    await page.waitForLoadState()
    await toolsPage.search('Saw')
    await accessoryPage.saw.waitFor()
    await accessoryPage.saw.click()
    await toolsPage.changeItemAmount(5)
    await toolsPage.addToCart(arrayProducts)
    virtualBasketCount = await toolsPage.getItemAmountInArrayCart(arrayProducts)

    await expect(accessoryPage.productAddedMessage).toBeVisible()
    await expect(accessoryPage.cartCount).toHaveText(
      virtualBasketCount.toString(),
    )

    //                         ~~CART~~
    // using this loop tells us if this, what we have in our virtual basket equals what we have in cart on the web
    await accessoryPage.openCart()
    // for every lineItem we get its name and we compare it with array element
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

      // for every line we check price of product
      const priceForProduct = await cartPage.getPrice(i)
      await expect(priceForProduct).toEqual(arrayProducts[i].price)
      // we check if quantity * price = total

      const priceTotalForProduct = await cartPage.getTotal(i)
      const expectedTotalPriceForProduct = quantityOfProduct * priceForProduct
      await expect(priceTotalForProduct).toEqual(expectedTotalPriceForProduct)
      calculatedSum += priceTotalForProduct
      sumTotal += arrayProducts[i].price * arrayProducts[i].quantity
    }

    await accessoryPage.confirmCart()

    // already signed in💥
    await accessoryPage.confirmLoginData()

    //                  ~~ DELIVERY FORM ~~
    // we need to fill delivery form and we overwrite built-in data
    await page.waitForTimeout(3000) // timeout is needed so we can overwrite predefined address
    await deliveryPage.fillDeliveryForm(deliveryPage.billingAddress)
    await deliveryPage.confirmAddress()

    //                ~~ PAYMENT ~~
    const headerPayment = paymentPage.h3Payment
    await expect(headerPayment).toBeVisible()

    const payment: PaymentModel = {
      method: 'Credit Card',
      creditCardModel: {
        creditCardNumber: '1111-2222-3333-4444',
        expirationDate: '10/2025',
        CVV: '123',
        cardHolderName: 'V',
      },
    }
    await paymentPage.fillPaymentForm(payment)

    await paymentPage.confirmPayment()

    await expect(paymentPage.paymentSuccessful).toHaveText(
      'Payment was successful',
    )
    await paymentPage.confirmPayment()
    await expect(paymentPage.orderSuccessfulMessage).toContainText(
      'Thanks for your order! Your invoice number is INV',
    )
  })
})
