import { Locator, Page } from '@playwright/test'

export class FavoritePage {
  readonly page: Page

  readonly mainMenu: Locator
  readonly dropdownItemFavorite: Locator
  readonly favoriteTitle: Locator
  readonly itemSlipJointPliers: Locator
  readonly addToFavoritesButton: Locator
  readonly itemAddedToFavoriteSection: Locator

  constructor(page: Page) {
    this.page = page
    this.mainMenu = page.locator('#menu')
    this.dropdownItemFavorite = page.getByText('My favorites')
    this.favoriteTitle = page.locator('[data-test="page-title"]')
    this.itemSlipJointPliers = page.getByText('Slip Joint Pliers')
    this.addToFavoritesButton = page.locator('#btn-add-to-favorites')
    this.itemAddedToFavoriteSection = page.locator('[data-test="product-name"]')
  }
}
