import { expect, fixtures as test } from '../fixtures/fixtures.fixture'

test.describe('Verify search functionality', () => {
  test.beforeEach(async ({ searchPage }) => {
    if (
      (await searchPage.page.title()) !==
      'Practice Software Testing - Toolshop - v5.0'
    ) {
      throw new Error('Page title is not as expected')
    }
  })

  test('Verify that search input is visible', async ({ searchPage }) => {
    const searchInput = searchPage.searchInput
    await expect(searchInput).toBeVisible()
  })

  test('Verify that user can type in the search input', async ({
    searchPage,
  }) => {
    const searchInput = searchPage.searchInput
    await searchPage.typeInSearchInput('test product')
    await expect(searchInput).toHaveValue('test product')
  })
})
