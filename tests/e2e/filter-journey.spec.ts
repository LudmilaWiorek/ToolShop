// import { expect, fixtures as test } from '../.././fixtures.fixture'
import { FilterCategory } from '../../enums/filter.enum'
import { expect, fixtures as test } from '../../fixtures/fixtures.fixture'
import { FilterPage } from '../../pages/filter.page'

test.describe('Testing filter journey', () => {
  let filterPage: FilterPage
  test('filter by category', async ({ loginPage, page }) => {
    filterPage = new FilterPage(page)
    await loginPage.goToPage()

    await expect(
      await filterPage.getLocatorByMainCategory(FilterCategory.hand_tools),
    ).toBeVisible()
  })
})
