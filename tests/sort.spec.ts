// import { expect, fixtures as test } from '../fixtures/fixtures.fixture'
import { SortPage } from '../pages/sort.page'
import { expect, test } from '@playwright/test'

test.describe('Sort functionality', () => {
  let sortPage: SortPage
  test.beforeEach(async ({ page }) => {
    sortPage = new SortPage(page)
    await page.goto('/')
  })
  test('Verify that sort options are visible', async ({ page }) => {
    const sortHeader = sortPage.sortHeader
    const selectForm = sortPage.selectForm
    await expect(sortHeader).toBeVisible()
    await expect(sortHeader).toHaveText('Sort')
    await expect(selectForm).toBeVisible()
    await expect(selectForm).toHaveAttribute('aria-label')

    await selectForm.click()
    await selectForm.selectOption({ value: 'name,desc' })
    await page.waitForTimeout(1000)
    const h5selectors = page.locator('h5')
    await expect(h5selectors).toHaveCount(9)
    const h5Texts = await h5selectors.allTextContents()
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
    await expect(h5Texts).toEqual(expectedTexts)
  })
})
