import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'

export class FavoritePage extends BasePage {
  readonly mainMenu: Locator
  readonly dropdownItemFavorite: Locator
  readonly favoriteTitle: Locator
  readonly itemSlipJointPliers: Locator
  readonly addToFavoritesButton: Locator
  readonly itemAddedToFavoriteSection: Locator
  readonly messageFavoriteItemAdded: Locator
  readonly productCard: Locator
  readonly removeButtons: Locator
  readonly favoriteItemLine: Locator
  readonly noFavoritesOnList: Locator

  url = '/products'

  constructor(page: Page) {
    super(page) // super page calls constructor from BasePage;
    // super page must be the first line in constructor

    this.mainMenu = page.locator('#menu')
    this.dropdownItemFavorite = page.getByText('My favorites')
    this.favoriteTitle = page.locator('[data-test="page-title"]')
    this.itemSlipJointPliers = page.getByText('Slip Joint Pliers')
    this.addToFavoritesButton = page.locator('#btn-add-to-favorites')
    this.itemAddedToFavoriteSection = page.locator('[data-test="product-name"]')
    this.messageFavoriteItemAdded = page.getByLabel(
      'Product added to your favorites list.',
    )
    this.productCard = page.locator('[data-test^="product-"]')
    this.removeButtons = page.locator('[data-test="delete"]')
    this.favoriteItemLine = page.locator('.col-md-7')
    this.noFavoritesOnList = page.getByText(
      ' There are no favorites yet. In order to add favorites, please go to the product listing and mark some products as your favorite. ',
    )
  }
  async clearAllFavoritesCompletely(): Promise<void> {
    const buttonCount = await this.removeButtons.count()

    if (buttonCount === 0) return // Baza rekurencji

    await this.removeButtons.first().click()
    await this.page.waitForTimeout(1000)

    // Rekurencyjne wywołanie
    await this.clearAllFavoritesCompletely()
  }
}
