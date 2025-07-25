import { expect, fixtures as test } from '../fixtures/fixtures.fixture'

test.describe.parallel('Slider of Price Range', () => {
  test.beforeEach(async ({ sliderPage }) => {
    if (
      (await sliderPage.page.title()) !==
      'Practice Software Testing - Toolshop - v5.0'
    ) {
      throw new Error('Page title is not as expected')
    }
  })
  test('Verify that slider is visible', async ({ sliderPage }) => {
    const slider = sliderPage.slider
    await sliderPage.isSliderVisible()
    await expect(slider).toBeVisible()
  })
  test('Verify standard slider value', async ({ sliderPage }) => {
    const sliderValueLocator = sliderPage.sliderPoint
    const sliderValue = await sliderPage.getSliderValue()
    await expect(sliderValueLocator).toHaveAttribute('aria-valuenow', '100')
    await expect(sliderValue).toBe('100')
  })
  test('Verify that slider can be moved to maximum value 200 without errors', async ({
    sliderPage,
  }) => {
    const sliderPoint = sliderPage.sliderPoint
    await sliderPage.setSliderValue(200)
    await expect(sliderPoint).toHaveAttribute('aria-valuenow', '200')
  })
  test('Should set slider value to 100', async ({ sliderPage }) => {
    const value = await sliderPage.getSliderValue()
    await sliderPage.setSliderValue(100)
    expect(value).toBe('100')
  })
  test('Should get the minimum slider value', async ({ sliderPage }) => {
    const minValue = await sliderPage.getSliderMinValue()
    expect(minValue).toBe('0')
  })
  test('Should get the maximum slider value', async ({ sliderPage }) => {
    const maxValue = await sliderPage.getSliderMaxValue()
    expect(maxValue).toBe('200')
  })
  test('Should set slider value to 200', async ({ sliderPage }) => {
    await sliderPage.setSliderValue(200)
    const value = await sliderPage.getSliderValue()
    await expect(value).toBe('200')
  })
  test('Should not allow setting slider value below minimum', async ({
    sliderPage,
  }) => {
    const value = await sliderPage.getSliderValue()
    await sliderPage.setSliderValue(-10)
    expect(parseInt(value)).toBeGreaterThanOrEqual(0)
  })
  test('Should not allow setting slider value above maximum', async ({
    sliderPage,
  }) => {
    const value = await sliderPage.getSliderValue()
    await sliderPage.setSliderValue(250)
    expect(parseInt(value)).toBeLessThanOrEqual(200)
  })
  test('Verify if list of products is filtered correctly after setting slider value', async ({
    sliderPage,
    page,
  }) => {
    await sliderPage.moveSliderWithMouse(44, 10, 'left')
    const maxSliderValueAfterMoving = await sliderPage.getSliderValue()
    await expect(maxSliderValueAfterMoving).toBe('62')

    const listOfProductPrice = page
      .locator('//span[@data-test="product-price"]')
      .all()

    let price: number
    for (const productPrice of await listOfProductPrice) {
      price = await sliderPage.getFloatFromProductPrice(productPrice)

      expect(price).toBeLessThanOrEqual(parseFloat(maxSliderValueAfterMoving))
    }
  })
})
