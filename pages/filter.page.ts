import { BasePage } from './base.page'
import {
  FilterBrand,
  FilterCategory,
  HandToolsFilter,
  OtherFilter,
  PowerToolsFilter,
} from '@enums/filter.enum'
import { Locator, Page } from '@playwright/test'

export class FilterPage extends BasePage {
  readonly byBrandFilter: Locator
  readonly forgeFlexCheckbox: Locator
  readonly mightyCraftHardwareCheckbox: Locator

  readonly noProductsFoundMessage: Locator

  constructor(page: Page) {
    super(page)

    //filter by brand
    this.byBrandFilter = page.getByText(' By Brand ')
    this.forgeFlexCheckbox = page.getByText(' ForgeFlex ')
    this.mightyCraftHardwareCheckbox = page.getByText(' MightyCraft Hardware ')

    this.noProductsFoundMessage = page.getByText('There are no products found.')
  }
  getLocatorByMainCategory(category: FilterCategory): Locator {
    return this.page.getByLabel(category)
  }
  async getLocatorBySubCategory(
    subcategory: HandToolsFilter | PowerToolsFilter | OtherFilter,
  ): Promise<Locator> {
    return this.page.getByText(subcategory)
  }
  async getLocatorByBrand(brand: FilterBrand): Promise<Locator> {
    return this.page.getByText(brand)
  }
}
