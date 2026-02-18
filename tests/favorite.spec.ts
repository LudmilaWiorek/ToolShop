import { expect, fixtures as test } from '@fixtures/fixtures.fixture'

// flaky test
test.use({
  launchOptions: {
    slowMo: 300, // 100ms pauza między akcjami
  },
})
test.describe('Testing favorite module', () => {
  test('successful add to favorite section', async ({
    accessoryPage,
    favoritePage,
    page,
  }) => {
    // STEP 1: Go to favorites and clear EVERYTHING
    await favoritePage.mainMenu.click()
    await favoritePage.dropdownItemFavorite.click()
    await expect(favoritePage.favoriteTitle).toBeVisible()

    // clearing everything
    await favoritePage.clearAllFavoritesCompletely()
    await page.waitForTimeout(5000) // timeout here ensures the list is empty
    await expect(favoritePage.removeButtons).toHaveCount(0)
    await expect(favoritePage.favoriteItemLine).toHaveCount(0)
    await expect(favoritePage.favoriteItemLine).toBeHidden()
    // STEP 2: Go to homepage and pick ANY product (favorites are empty now)
    await accessoryPage.logoToolShop.click()

    const containerWithProducts = page.locator('.col-md-9')
    await expect(containerWithProducts).toBeVisible()
    await expect(favoritePage.productCard.nth(3)).toBeVisible()
    await favoritePage.productCard.first().click()

    await expect(favoritePage.addToFavoritesButton).toBeVisible()
    await favoritePage.addToFavoritesButton.click({ timeout: 10_000 })

    // STEP 4: Verify it was added successfully
    await favoritePage.mainMenu.click()
    await favoritePage.dropdownItemFavorite.click()
    await expect(favoritePage.favoriteTitle).toBeVisible()

    await expect(favoritePage.messageFavoriteItemAdded).toBeVisible()
  })
})



