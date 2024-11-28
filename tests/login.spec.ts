import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import * as users from '../JSONS/users.json'

test.describe('login section tests', () => {
  let loginPage: LoginPage
  test.beforeEach('go to page practice software testing', async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goToPage()
  })
  //positive scenarios
  // documentation of test cases this case was titled "valid email with a lowercase letter;

  test('login with correct credentials', async ({ page }) => {
    const dataEmail = users.userdata[0].email
    const dataPass = users.userdata[0].password
    const pageTitle = page.locator('[data-test="page-title"]')
    const textMyAccount = 'My account'

    await loginPage.login(dataEmail, dataPass)
    await page.waitForLoadState()
    await expect(pageTitle).toContainText(textMyAccount)
  })
  // I changed for "uppercase" due to valid account details provided in Github repository of practicesoftwaretesting
  // we agreed that this test case is strong "depends", I decided to include it here anyway
  test('login with correct credentials - valid email started with a uppercase letter', async ({
    page,
  }) => {
    const dataEmail = 'Customer2@practicesoftwaretesting.com'
    const dataPass = users.userdata[0].password
    const pageTitle = page.locator('[data-test="page-title"]')
    const textMyAccount = 'My account'

    await loginPage.login(dataEmail, dataPass)

    await expect(pageTitle).toContainText(textMyAccount)
  })
  //negative scenarios

  test('unsuccessful login with incorrect email', async ({ page }) => {
    const dataEmail = 'CustomerXXX@practicesoftwaretesting.com'
    const dataPass = users.userdata[0].password
    const errorEmailOrPassword = page.locator('.help-block')
    const textInvalidData = 'Invalid email or password'

    await loginPage.login(dataEmail, dataPass)

    await expect(errorEmailOrPassword).toHaveText(textInvalidData)
  })

  test('unsuccessful login with incorrect password', async ({ page }) => {
    const dataEmail = 'Customer2@practicesoftwaretesting.com'
    const dataPass = 'welcome111'
    const errorEmailOrPassword = page.locator('.help-block')
    const textInvalidData = 'Invalid email or password'

    await loginPage.login(dataEmail, dataPass)

    await expect(errorEmailOrPassword).toHaveText(textInvalidData)
  })
})
