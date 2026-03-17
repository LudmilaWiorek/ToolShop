import { BasePage } from '@base.page'
import { ProductModel } from '@models/addProduct.model'
import { Locator, Page } from '@playwright/test'

export class AddProductPage extends BasePage {
  readonly clickAddProductButton: Locator
  readonly inputName: Locator
  readonly inputDescription: Locator
  readonly inputStock: Locator
  readonly inputPrice: Locator
  readonly locationOffer: Locator
  readonly itemForRent: Locator
  readonly inputBrand: Locator
  readonly inputCategory: Locator
  readonly inputImage: Locator
  readonly saveButton: Locator
  readonly successfulMessage: Locator

  constructor(page: Page) {
    super(page)
    this.clickAddProductButton = page.getByRole('button', {
      name: 'Add Product',
    })
    this.inputName = page.locator('#name')
    this.inputDescription = page.locator('#description')
    this.inputStock = page.locator('#stock')
    this.inputPrice = page.locator('#price')
    this.locationOffer = page.locator('#is_location_offer')
    this.itemForRent = page.locator('#is_rental')

    this.inputBrand = page.locator('#brand_id')
    this.inputCategory = page.locator('#category_id')
    this.inputImage = page.locator('#product_image_id')

    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.successfulMessage = page.locator('.alert-success')
  }

  async gotoPage(): Promise<void> {
    await this.page.goto('/admin/products/add')
    await this.page.waitForLoadState()
  }

  async fillProductForm(product: ProductModel): Promise<void> {
    await this.inputName.fill(product.name)
    await this.inputDescription.fill(product.description)
    await this.inputStock.fill(product.stock.toString())
    await this.inputPrice.fill(product.price.toString())
    if (product.location_offer) {
      await this.locationOffer.check()
    }
    if (product.item_for_rent) {
      await this.itemForRent.check()
    }
    await this.inputBrand.selectOption(product.brand)
    await this.inputCategory.selectOption(product.category)
    await this.inputImage.selectOption(product.image)
    await this.saveButton.click()
  }
  async createProduct(product: ProductModel): Promise<void> {
    await this.fillProductForm(product)
  }
  //   async selectBrand(brand: string): Promise<void> {
  //     await this.inputBrand.selectOption(brand)
  //   }
  //   async selectCategory(category: string): Promise<void> {
  //     await this.inputCategory.selectOption(category)
  //   }
  //   async selectImage(image: string): Promise<void> {
  //     await this.inputImage.selectOption(image)
  //   }
}
