import {
  expect,
  apiAdminFixtures as test,
} from '../../fixtures/fixtures.fixture'

test.describe('testing admin role', () => {
  test.beforeEach('log admin', async ({ apiHeader, page }) => {
    const adminToken = apiHeader.Authorization.replace('Bearer', '')

    await page.goto('https://practicesoftwaretesting.com')

    await page.evaluate((adminToken) => {
      localStorage.setItem('auth-token', adminToken)
    }, adminToken)
  })
  test('delete user', async ({ page }) => {
    await page.goto('/admin/users')
    const deleteButton = page.locator('.btn-danger').nth(4)
    await expect(deleteButton).toBeVisible()
    await deleteButton.click()
    const alertMessage = page.locator('#toast-container')
    await expect(alertMessage).toHaveText(
      ' Seems like this customer is used elsewhere.',
    )
  })

  test('delete product', async ({ page }) => {
    await page.goto('/admin/products')

    const deleteButton = page.locator('.btn-danger').nth(0)
    const productName = page.getByRole('cell', { name: 'Combination Pliers' })
    const alertMessage = page.locator('#toast-container')

    await deleteButton.click()
    await expect.soft(productName).toBeVisible()
    await expect(alertMessage).toHaveText(
      'Seems like this product is used elsewhere.',
    )
  })
})
