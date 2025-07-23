// import { expect, fixtures as test } from '../fixtures/fixtures.fixture'
import { SortPage } from '../pages/sort.page'
import { expect, test } from '@playwright/test'

test.describe('Sort functionality', () => {
  let sortPage: SortPage
  test('Verify that sort options are visible', async ({ page }) => {
    sortPage = new SortPage(page)
    await page.goto('/')
    const sortHeader = sortPage.sortHeader
    const selectForm = sortPage.selectForm
    await expect(sortHeader).toBeVisible()
    await expect(sortHeader).toHaveText('Sort')
    await expect(selectForm).toBeVisible()
    await expect(selectForm).toHaveAttribute('aria-label')
  })
})
