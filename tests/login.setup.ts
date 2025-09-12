import * as users from '../JSONS/users.json'
import { LoginPage } from '../pages/login.page'
import { SESSION_PATH } from '../playwright.config'
import { expect, test } from '@playwright/test'

let loginPage: LoginPage
test('authentication', async ({ page }) => {
  loginPage = new LoginPage(page)
  await loginPage.goToPage()

  const dataEmail = users.userdata.user[0].email
  const dataPass = users.userdata.user[0].password
  const pageHeader = loginPage.pageHeader
  const textHeader = 'My account'

  await loginPage.login(dataEmail, dataPass)
  await expect(pageHeader).toContainText(textHeader)
  //save session:
  await page.context().storageState({ path: SESSION_PATH })
})
