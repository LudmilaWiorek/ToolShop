import { Locator, Page } from '@playwright/test'

export class SliderPage {
  readonly page: Page
  readonly slider: Locator
  readonly sliderPoint: Locator
  readonly boxSlider: Locator
  constructor(page: Page) {
    this.page = page

    this.slider = this.page.locator('.ngx-slider-selection-bar')
    this.sliderPoint = page.locator('.ngx-slider-pointer').nth(1)
    this.boxSlider = page.locator('.ngx-slider.animate')
  }

  async getSliderValue(): Promise<string> {
    const sliderValue = await this.sliderPoint.getAttribute('aria-valuenow')
    if (sliderValue == null) {
      throw new Error('Slider aria value not found')
    }
    return sliderValue
  }

  async setSliderValue(value: number): Promise<number> {
    await this.sliderPoint.evaluate((el, value) => {
      el.setAttribute('aria-valuenow', value.toString())
      el.style.left = `${value}px`
    }, value)
    return value
  }
  async getBoundingBox(): Promise<{
    x: number
    y: number
    width: number
    height: number
  }> {
    const sliderTrack = await this.boxSlider.boundingBox()
    if (sliderTrack == null) {
      throw new Error('Slider track bounding box not found')
    }
    return sliderTrack
  }

  async getFloatFromProductPrice(productPrice: Locator): Promise<number> {
    const priceText = await productPrice.textContent()
    if (priceText) {
      const price = parseFloat(priceText.replace('$', '').trim())
      return price
    }
    return 0
  }

  async isSliderVisible(): Promise<boolean> {
    return await this.slider.isVisible()
  }

  async getSliderMinValue(): Promise<string | null> {
    return await this.sliderPoint.getAttribute('aria-valuemin')
  }

  async getSliderMaxValue(): Promise<string | null> {
    return await this.sliderPoint.getAttribute('aria-valuemax')
  }
  async moveSliderWithMouse(
    stepSize: number = 1,
    steps: number = 10,
    direction: 'left' | 'right',
  ): Promise<void> {
    const sliderTrack = await this.getBoundingBox()

    const targetX = sliderTrack.x + sliderTrack.width / 2 // target x - srodek slidera
    const targetY = sliderTrack.y + sliderTrack.height / 2
    // add condition to determine the direction of movement
    const offset = direction === 'left' ? -stepSize : stepSize // offset - liczba pixeli o jakie chcemy przesunac
    await this.page.mouse.move(targetX, targetY)
    await this.page.mouse.down()
    await this.page.mouse.move(targetX + offset, targetY, { steps }) // targetx + offset - daje nowa pozycje, do ktorej przesuwasz myszke
    await this.page.mouse.up()
  }
}
