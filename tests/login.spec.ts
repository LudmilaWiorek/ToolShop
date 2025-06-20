import * as users from '../JSONS/users.json'
import { LoginPage } from '../pages/login.page'
import { expect, test } from '@playwright/test'

test.describe('login section tests', () => {
  let loginPage: LoginPage
  test.beforeEach('go to page practice software testing', async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goToPage()
  })
  //positive scenarios

  test('login user with correct credentials', async () => {
    const dataEmail = users.userdata.user[0].email
    const dataPass = users.userdata.user[0].password
    const pageHeader = loginPage.pageHeader
    const textHeader = 'My account'
    const textTitle = 'Overview'

    await loginPage.login(dataEmail, dataPass)
    await loginPage.page.waitForLoadState()
    await expect(pageHeader).toContainText(textHeader)
    await expect(await loginPage.page.title()).toContain(textTitle)
  })

  test('login admin with correct credentials', async () => {
    const dataEmail = users.userdata.admin[0].email
    const dataPass = users.userdata.admin[0].password
    const pageHeader = loginPage.pageHeader
    const textHeader = 'Sales over the years'
    const textTitle = 'Dashboard'

    await loginPage.login(dataEmail, dataPass)
    await loginPage.page.waitForLoadState()
    await expect(pageHeader).toContainText(textHeader)
    await expect(await loginPage.page.title()).toContain(textTitle)
  })
  test('login  user with correct credentials - valid email started with a uppercase letter', async () => {
    const dataEmail = 'Customer2@practicesoftwaretesting.com'
    const dataPass = users.userdata.user[0].password
    const pageHeader = loginPage.pageHeader
    const textHeader = 'My account'

    await loginPage.login(dataEmail, dataPass)

    await expect(pageHeader).toContainText(textHeader)
  })
  //negative scenarios

  test('unsuccessful user login with incorrect email', async () => {
    const dataEmail = 'customerXXX@practicesoftwaretesting.com'
    const dataPass = users.userdata.user[0].password
    const errorEmailOrPassword = loginPage.errorMessage
    const textInvalidData = loginPage.textInvalidData

    await loginPage.login(dataEmail, dataPass)

    await expect(errorEmailOrPassword).toHaveText(textInvalidData)
  })

  test('unsuccessful user login with incorrect password', async () => {
    const dataEmail = users.userdata.user[0].email
    const dataPass = 'welcome111'
    const errorEmailOrPassword = loginPage.errorMessage
    const textInvalidData = loginPage.textInvalidData

    await loginPage.login(dataEmail, dataPass)

    await expect(errorEmailOrPassword).toHaveText(textInvalidData)
  })
})
