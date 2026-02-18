import { productModelFactory } from '@factories/addProduct.factory'
import { AddProductPage } from '@pages/shopping/addProduct.page'
import { expect, test } from '@playwright/test'

test('add product', async ({ page }) => {
  const addProductPage = new AddProductPage(page)
  const product = await productModelFactory(page)
  const successfulMessage = 'Product saved!'

  await expect(product).toBeDefined()
  await expect(addProductPage.successfulMessage).toHaveText(successfulMessage)
})
