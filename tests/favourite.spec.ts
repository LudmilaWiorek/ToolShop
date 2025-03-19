import { fixtures as test } from '../fixtures/fixtures.fixture'
import { AccessoryPage } from '../pages/accessory.page'
import { FavoritePage } from '../pages/favorite.page'
import { expect } from '@playwright/test'

test.describe('testing favorite module', () => {
  let favoritePage: FavoritePage
  let accessoryPage: AccessoryPage
  test.beforeEach('login with correct credentials', async ({ loginPage }) => {
    const arrayUrl = await loginPage.page.url().split('/')
    const lastArrayElement = await arrayUrl[arrayUrl.length - 1]
    if (lastArrayElement !== 'account') {
      throw 'login failed'
    }
    await loginPage.goToPage()
  })
  test('positive - add to favorite section', async ({ page }) => {
    favoritePage = new FavoritePage(page)
    accessoryPage = new AccessoryPage(page)

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

// testing cloned repo