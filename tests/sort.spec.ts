// import { expect, fixtures as test } from '../fixtures/fixtures.fixture'
import { SortPage } from '../pages/sort.page'
import { expect, test } from '@playwright/test'

test.describe('Sort functionality', () => {
  let sortPage: SortPage
  test.beforeEach(async ({ page }) => {
    sortPage = new SortPage(page)
    await page.goto('/')
  })
  test('Verify that sort options are visible', async () => {
    const sortHeader = sortPage.sortHeader
    const selectForm = sortPage.selectForm
    await expect(sortHeader).toBeVisible()
    await expect(sortHeader).toHaveText('Sort')
    await expect(selectForm).toBeVisible()
    await expect(selectForm).toHaveAttribute('aria-label')
  })
  test('Verify that sort options are applied correctly', async ({ page }) => {
    await sortPage.clickSortOption()
    await sortPage.openSortOptions()
    await page.waitForTimeout(1000) // Wait for the options to be applied
    const productName = sortPage.productNameHeaders
    await expect(productName).toHaveCount(9)
    const productNameText = await sortPage.getProductNames()
    const expectedTexts = [
      ' Wood Saw ',
      ' Wood Carving Chisels ',
      ' Washers ',
      ' Tool Cabinet ',
      ' Thor Hammer ',
      ' Tape Measure 7.5m ',
      ' Tape Measure 5m ',
      ' Swiss Woodcarving Chisels ',
      ' Super-thin Protection Gloves ',
    ]
    await expect(productNameText).toEqual(expectedTexts)
  })
})
