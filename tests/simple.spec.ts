import { expect, test } from '@playwright/test'

test('Simple test of choosing category using TestCraft AI tool', async ({
  page,
}) => {
  await page.goto('/')

  const categoryButton = page.locator('[data-test="nav-categories"]')
  await expect(categoryButton).toBeVisible()

  await categoryButton.click()
  const powerToolsLink = page.locator('a', { hasText: 'Power Tools' })
  await expect(powerToolsLink).toBeVisible()
  await powerToolsLink.click()
  await expect(page).toHaveURL(
    'https://practicesoftwaretesting.com/category/power-tools',
  )
})
