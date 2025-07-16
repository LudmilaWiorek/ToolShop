import { Locator, Page } from '@playwright/test'

export class SliderPage {
  readonly page: Page
  readonly slider: Locator
  readonly sliderPoint: Locator
  constructor(page: Page) {
    this.page = page

    this.slider = this.page.locator('.ngx-slider-selection-bar')
    this.sliderPoint = page.locator('.ngx-slider-pointer').nth(1)
  }

  async getSliderValue(): Promise<string> {
    return await this.sliderPoint.getAttribute('aria-valuenow')
  }

  async setSliderValue(value: number): Promise<number> {
    await this.sliderPoint.evaluate((el, value) => {
      el.setAttribute('aria-valuenow', value.toString())
      el.style.left = `${value}px`
    }, value)
    return value
  }

  async isSliderVisible(): Promise<boolean> {
    return await this.slider.isVisible()
  }

  async getSliderMinValue(): Promise<string> {
    return await this.sliderPoint.getAttribute('aria-valuemin')
  }

  async getSliderMaxValue(): Promise<string> {
    return await this.sliderPoint.getAttribute('aria-valuemax')
  }
}
