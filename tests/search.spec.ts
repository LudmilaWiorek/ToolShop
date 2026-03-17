import { expect, fixtures as test } from '@fixtures/pages.fixture'

test.describe('Testing search module', () => {
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

  test('Verify that input is secured from XSS attack', async ({
    searchPage,
  }) => {
    const searchInput = searchPage.searchInput
    await searchPage.typeInSearchInput('<script>alert("XSS")</script>')
    await searchPage.typeInSearchInput('<script>alert(1)</script>')
    await expect(searchInput).not.toHaveValue('alert(1)')
  })
})
