import { SliderPage } from '../pages/slider.page'
import { expect, test } from '@playwright/test'

test.describe('Slider of Price Range', () => {
  let sliderPage: SliderPage
  test.beforeEach(async ({ page }) => {
    sliderPage = new SliderPage(page)
    await page.goto('/')
    if (
      (await page.title()) !== 'Practice Software Testing - Toolshop - v5.0'
    ) {
      throw new Error('Page title is not as expected')
    }
  })
  test('Verify that slider is visible', async () => {
    const slider = sliderPage.slider
    await sliderPage.isSliderVisible()
    await expect(slider).toBeVisible()
  })
  test('Verify that slider can be moved to maximum value 200 without errors', async () => {
    const sliderPoint = sliderPage.sliderPoint

    await expect(sliderPoint).toHaveAttribute('aria-valuetext', '100')

    await sliderPage.setSliderValue(200)
    await expect(sliderPoint).toHaveAttribute('aria-valuenow', '200')
  })
})
