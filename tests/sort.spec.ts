import { OrderByEnum } from '../enums/orderBy.enum'
import { expect, fixtures as test } from '../fixtures/fixtures.fixture'

test.describe('Sort functionality', () => {
  test('Verify that sort options are visible', async ({ sortDropdownPage }) => {
    const sortHeader = sortDropdownPage.sortHeader
    const selectForm = sortDropdownPage.selectForm
    await expect(sortHeader).toBeVisible()
    await expect(sortHeader).toHaveText('Sort')
    await expect(selectForm).toBeVisible()
    await expect(selectForm).toHaveAttribute('aria-label')
  })
  test('Verify that sort options are applied correctly - A-Z ascending order', async ({
    sortDropdownPage,
  }) => {
    const productName = sortDropdownPage.productNameHeaders
    const expectedTexts = [
      ' Adjustable Wrench ',
      ' Angled Spanner ',
      ' Belt Sander ',
      ' Bolt Cutters ',
      ' Chisels Set ',
      ' Circular Saw ',
      ' Claw Hammer ',
      ' Claw Hammer with Fiberglass Handle ',
      ' Claw Hammer with Shock Reduction Grip ',
    ]
    const orderBy = OrderByEnum.nameAsc

    await sortDropdownPage.clickSortOption()
    await sortDropdownPage.selectOrderOption(orderBy)
    await sortDropdownPage.page.waitForTimeout(1000) // Wait for the options to be applied
    await expect(productName).toHaveCount(9)
    const productNameText = await sortDropdownPage.getProductNames()
    await expect(productNameText).toEqual(expectedTexts)
  })
  test('Verify that sort options are applied correctly - Z_A descending order', async ({
    sortDropdownPage,
  }) => {
    const productName = sortDropdownPage.productNameHeaders
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
    const orderBy = OrderByEnum.nameDesc
    await sortDropdownPage.clickSortOption()
    await sortDropdownPage.selectOrderOption(orderBy)
    await sortDropdownPage.page.waitForTimeout(1000) // Wait for the options to be applied
    await expect(productName).toHaveCount(9)
    const productNameText = await sortDropdownPage.getProductNames()
    await expect(productNameText).toEqual(expectedTexts)
  })
})
