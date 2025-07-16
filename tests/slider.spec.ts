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
  test('Verify standard slider value', async () => {
    const sliderValueLocator = sliderPage.sliderPoint
    const sliderValue = await sliderPage.getSliderValue()
    await expect(sliderValueLocator).toHaveAttribute('aria-valuenow', '100')
    await expect(sliderValue).toBe('100')
  })
  test('Verify that slider can be moved to maximum value 200 without errors', async () => {
    const sliderPoint = sliderPage.sliderPoint
    await sliderPage.setSliderValue(200)
    await expect(sliderPoint).toHaveAttribute('aria-valuenow', '200')
  })
  test('should set slider value to 100', async () => {
    const value = await sliderPage.getSliderValue()
    await sliderPage.setSliderValue(100)
    expect(value).toBe('100')
  })
  test('should get the minimum slider value', async () => {
    const minValue = await sliderPage.getSliderMinValue()
    expect(minValue).toBe('0')
  })
})
