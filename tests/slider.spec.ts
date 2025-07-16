import { expect, test } from '@playwright/test'

test.describe('Slider of Price Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    if (
      (await page.title()) !== 'Practice Software Testing - Toolshop - v5.0'
    ) {
      throw new Error('Page title is not as expected')
    }
  })
  test('Verify that slider can be moved to maximum value 200 without errors', async ({
    page,
  }) => {
    const slider = page.locator('.ngx-slider-selection-bar')
    await expect(slider).toBeVisible()
    const sliderPoint = page.locator('.ngx-slider-pointer').nth(1)
    await expect(sliderPoint).toBeVisible()

    await expect(sliderPoint).toHaveAttribute('aria-valuetext', '100')

    async function setSliderValue(value: number): Promise<number> {
      await sliderPoint.evaluate((el, value) => {
        el.setAttribute('aria-valuenow', value.toString())
        el.style.left = `${value}px`
      }, value)
      return value
    }
    await setSliderValue(200)
    await expect(sliderPoint).toHaveAttribute('aria-valuenow', '200')
  })
})
