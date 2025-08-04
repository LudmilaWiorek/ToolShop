import { expect, fixtures as test } from '../fixtures/fixtures.fixture'

test.describe('Testing favorite module', () => {
  test.beforeEach('login with correct credentials', async ({ loginPage }) => {
    const arrayUrl = await loginPage.page.url().split('/')
    const lastArrayElement = await arrayUrl[arrayUrl.length - 1]
    if (lastArrayElement !== 'account') {
      throw 'login failed'
    }
    await loginPage.goToPage()
  })
  test('successful add to favorite section', async ({
    accessoryPage,
    favoritePage: favoritePage,
  }) => {
    const slipJointPliersName = 'Slip Joint Pliers'
    const itemAddedToFavorite = 'Product added to your favorites list.'

    await favoritePage.mainMenu.click()
    await favoritePage.dropdownItemFavorite.click()
    await expect(favoritePage.favoriteTitle).toBeVisible()

    await accessoryPage.logoToolShop.click()

    await favoritePage.itemSlipJointPliers.click()
    await favoritePage.addToFavoritesButton.click()
    await favoritePage.mainMenu.click()
    await favoritePage.dropdownItemFavorite.click()

    await expect(favoritePage.favoriteTitle).toBeVisible()
    await expect(favoritePage.messageFavoriteItemAdded).toHaveText(
      itemAddedToFavorite,
    )
    await expect(favoritePage.itemAddedToFavoriteSection).toHaveText(
      slipJointPliersName,
    )
  })
})
