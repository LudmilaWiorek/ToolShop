import { test, expect, Page, request } from '@playwright/test'

test('registrationTest', async ({ page }) => {
  await page.goto('')
  await page.locator('[data-test="nav-sign-in"]').click()
  await page.locator('[data-test="register-link"]').click()
  await page.locator('[data-test="first-name"]').fill('Tom')
  await page.locator('[data-test="last-name"]').fill('Riddle')
  await page.locator('[data-test="dob"]').fill('2000-01-01')
  await page.locator('[data-test="address"]').fill('Elm street 14')
  await page.locator('[data-test="postcode"]').fill('10-100')
  await page.locator('[data-test="city"]').fill('City')
  await page.locator('[data-test="state"]').fill('State')
  await page.locator('[data-test="country"]').selectOption('CV')
  await page.locator('[data-test="country"]').press('Tab')
  await page.locator('[data-test="phone"]').fill('111222333')
  await page.locator('[data-test="email"]').fill('TomRiddle223456@test.com')
  await page.locator('[data-test="password"]').fill('Marvelous12#')
  await page.locator('[data-test="register-submit"]').press('Enter')

  await page.waitForLoadState()
})

test.describe('login section tests', () => {
  test('login with correct credentials', async ({ page }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    await page.locator('[data-test="email"]').fill('TomRiddle223456@test.com')
    await page.locator('[data-test="password"]').fill('Marvelous12#')
    await page.locator('[data-test="login-submit"]').click()
    await expect(page.locator('[data-test="page-title"]')).toContainText(
      'My account',
    )
  })
  test('unsuccessful login with incorrect email', async ({ page }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    await page.locator('[data-test="email"]').fill('TomRiddle@test.com') //wrong email
    await page.locator('[data-test="password"]').fill('Marvelous12#')
    await page.locator('[data-test="login-submit"]').click()
    await expect(page.locator('.help-block')).toHaveText(
      'Invalid email or password',
    )
  })
  test('unsuccessful login with incorrect password', async ({ page }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    await page.locator('[data-test="email"]').fill('TomRiddle@test.com')
    await page.locator('[data-test="password"]').fill('Marvelous12#!!') //wrong password
    await page.locator('[data-test="login-submit"]').click()
    await expect(page.locator('.help-block')).toHaveText(
      'Invalid email or password',
    )
  })
  test('unsuccessful login with empty email', async ({ page }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    //empty email!
    await page.locator('[data-test="password"]').fill('Marvelous12#')
    await page.locator('[data-test="login-submit"]').click()
    await expect(page.locator('//*[(text()="Email is required")]')).toHaveText(
      'Email is required',
    )
  })
  test('unsuccessful login with empty password', async ({ page }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    await page.locator('[data-test="email"]').fill('TomRiddle@test.com')
    //empty password
    await page.locator('[data-test="login-submit"]').click()
    await expect(
      page.locator('//*[(text()="Password is required")]'),
    ).toHaveText('Password is required')
  })
  test('unsuccessful login with empty password and email', async ({ page }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    //empty email and password inputs
    await page.locator('[data-test="login-submit"]').click()
    await expect(page.locator('//*[(text()="Email is required")]')).toHaveText(
      'Email is required',
    )
    await expect(
      page.locator('//*[(text()="Password is required")]'),
    ).toHaveText('Password is required')
  })
  test('unsuccessful login with SQL injection in email', async ({ page }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    await page
      .locator('[data-test="email"]')
      .fill('TomRiddle@test.com OR 1 = 1') // SQL injection
    await page.locator('[data-test="password"]').fill('Marvelous12#')
    await page.locator('[data-test="login-submit"]').click()

    await expect(
      page.locator('//*[text()="Email format is invalid"]'),
    ).toHaveText('Email format is invalid')
  })
  test('unsuccessful login with SQL injection in password', async ({
    page,
  }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    await page.locator('[data-test="email"]').fill('TomRiddle@test.com')
    await page.locator('[data-test="password"]').fill('Marvelous12# OR 1 = 1') // SQL injection
    await page.locator('[data-test="login-submit"]').click()

    await expect(page.locator('.help-block')).toHaveText(
      'Invalid email or password',
    )
  })
  //poniżej dwa testy sprawdzające login za pomocą google account i ich rzeczywiste rezultaty
  test('login with Google account', async ({ page, browser }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    await page.locator('.google-sign-in-button').click()

    //czekamy na otwarcie nowego okna z errorem
    const [newPage] = await Promise.all([
      browser.contexts()[0].waitForEvent('page'),
      page.click('.google-sign-in-button'),
    ])

    await newPage.waitForLoadState()

    const url = newPage.url()
    expect(url).toBe(
      'https://api.practicesoftwaretesting.com/auth/social-login?provider=google',
    )
    console.log('Nowe okno zostało otwarte z URL:', url)

    const classLocator500Error = newPage.locator(
      // '//div[contains(@class,"ml-4")]',
      '.ml-4.text-lg',
    )
    await expect(classLocator500Error).toContainText(
      '                        Server Error                    ',
    )
  })
  test('login with Google account - request returns code 500', async ({
    page,
  }) => {
    await page.goto('')
    await page.locator('[data-test="nav-sign-in"]').click()
    await page.locator('.google-sign-in-button').click()
    const context = await request.newContext()

    const response = await context.get(
      // 'https://api.practicesoftwaretesting.com/endpoint-that-returns-500',
      'https://api.practicesoftwaretesting.com/auth/social-login?provider=google',
    
    )

    expect(response.status()).toBe(500) // dzieki not test przechodzi :)

    const responseBody = await response.text()
    console.log('Treść odpowiedzi:', responseBody)

    // Zakończ kontekst
    await context.dispose()
  })
})
