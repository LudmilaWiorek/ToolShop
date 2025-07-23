import { expect, fixtures as test } from '../fixtures/fixtures.fixture'

test.describe('Sort functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })
  test('Verify that sort options are visible', async ({ sortPage }) => {
    const sortHeader = sortPage.sortHeader
    const selectForm = sortPage.selectForm
    await expect(sortHeader).toBeVisible()
    await expect(sortHeader).toHaveText('Sort')
    await expect(selectForm).toBeVisible()
    await expect(selectForm).toHaveAttribute('aria-label')
  })
  test('Verify that sort options are applied correctly', async ({
    sortPage,
    page,
  }) => {
    const productName = sortPage.productNameHeaders
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
    await sortPage.clickSortOption()
    await sortPage.openSortOptions()
    await page.waitForTimeout(1000) // Wait for the options to be applied
    await expect(productName).toHaveCount(9)
    const productNameText = await sortPage.getProductNames()
    await expect(productNameText).toEqual(expectedTexts)
  })
})
