import * as users from '../JSONS/users.json'
import { ProductModel } from '../models/addProduct.model'
import { AddProductPage } from '../pages/addProduct.page'
import { LoginPage } from '../pages/login.page'
import { faker } from '@faker-js/faker'
import { Page } from '@playwright/test'

async function loginAsAdmin(page: Page): Promise<void> {
  const loginPage = new LoginPage(page)
  await loginPage.goToPage()
  const dataEmail = users.userdata.admin[0].email
  const dataPass = users.userdata.admin[0].password

  await loginPage.login(dataEmail, dataPass, true)
}

async function createNewProductModel(): Promise<ProductModel> {
  // page: Page,
  // const addProductPage = new AddProductPage(page)

  const product: ProductModel = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 1, max: 100 }),
    price: parseFloat(faker.commerce.price()),
    location_offer: true,
    item_for_rent: false,
    brand: 'ForgeFlex Tools',
    category: 'Hand Saw',
    image: 'Saw',
  }

  return product
}
//main factory

export async function productModelFactory(page): Promise<ProductModel> {
  await loginAsAdmin(page)
  const addProductPage = new AddProductPage(page)
  await addProductPage.gotoPage()
  const product = await createNewProductModel()
  await addProductPage.createProduct(product)
  return product
}
