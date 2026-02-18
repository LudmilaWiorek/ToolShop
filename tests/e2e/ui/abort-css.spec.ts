import { expect, test } from '@playwright/test'

test.describe('CSS Blocking Test', () => {
  test.beforeEach(async ({ context }) => {
    // Block any css requests for each test in this file.
    await context.route(/.css$/, (route) => route.abort())
  })
  test('block css using page.route', async ({ page }) => {
    await page.goto('/')

    // Verify that the page loads without CSS
    const nav = await page.$('nav')
    const backgroundColor = await nav.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    )

    // Check if the background color is not the default one - transparent
    expect(backgroundColor).toBe('rgba(0, 0, 0, 0)')
  })
})
