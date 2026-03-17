import { FilterCategory } from '@enums/filter.enum'
import { expect, fixtures as test } from '@fixtures/pages.fixture'
import { FilterPage } from '@pages/catalog/filter.page'

test.describe('Testing filter journey', () => {
  let filterPage: FilterPage
  test('filter by category', async ({ loginPage, page }) => {
    filterPage = new FilterPage(page)
    await loginPage.goToPage()

    await expect(
      filterPage.getLocatorByMainCategory(FilterCategory.hand_tools),
    ).toBeVisible()
  })
})
