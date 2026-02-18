# Testing Patterns and Best Practices

## Page Object Model Pattern

### Structure

All page interactions are organized in page classes that inherit from `BasePage`:

```typescript
export class LoginPage extends BasePage {
  readonly signInIcon: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.signInIcon = page.locator('[data-test="nav-sign-in"]')
    this.emailInput = page.locator('[data-test="email"]')
    this.passwordInput = page.locator('[data-test="password"]')
    this.submitButton = page.locator('[data-test="login-submit"]')
  }

  async goToPage(): Promise<void> {
    await this.page.goto('/')
  }

  async login(email: string, password: string): Promise<void> {
    await this.signInIcon.click()
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
```

### Advantages

- Locators are centralized and DRY
- UI changes only require updates in one place
- Tests are more readable and maintainable
- Encourages code reuse

## Test Organization

### By Type

- **E2E Tests** - Full user journeys
- **API Tests** - Direct endpoint testing
- **Integration Tests** - Multi-component flows

### By Feature/Domain

```
tests/
├── e2e/
│   ├── authentication/
│   ├── catalog/
│   └── shopping/
```

## Fixture Pattern

### Creating Reusable Test Setup

```typescript
export const fixtures = baseTest.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await use(loginPage)
  },
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await loginPage.login(email, password)
    await use(loginPage)
  },
})
```

### Usage in Tests

```typescript
import { expect, fixtures as test } from '@fixtures/pages.fixture'

test('user can login', async ({ loginPage }) => {
  // loginPage is automatically initialized by the fixture
  await loginPage.login(email, password)
  await expect(page).toHaveURL('/account')
})
```

## API Testing Pattern

### API Client Classes

```typescript
export class AuthApi extends BaseApi {
  async loginUser(email: string, password: string): Promise<string> {
    const response = await this.request.post(`${this.baseUrl}/users/login`, {
      data: { email, password },
    })
    if (response.status() != 200) throw new Error('Cannot log in!')
    const json = await response.json()
    this.headers = { Authorization: `Bearer ${json.access_token}` }
    return json.access_token
  }
}
```

### Testing APIs Directly

```typescript
import { expect, fixtures as test } from '@fixtures/api.fixture'

test('add product to cart via API', async ({ apiClass, request }) => {
  const cartId = await apiClass.createCart()
  const products = await apiClass.getXItems(2)
  await apiClass.addItem(products[0], 1, cartId)
  const items = await apiClass.getItemsFromCart(cartId)
  expect(items).toHaveLength(1)
})
```

## Data Factory Pattern

### Generating Test Data

```typescript
export const getProductIdNotInList = async (
  request: APIRequestContext,
  excludeIds: string[],
): Promise<string> => {
  const response = await request.get(
    'https://api.practicesoftwaretesting.com/products/',
  )
  const json = await response.json()
  const productIds = json.data.map((p) => p.id)

  const availableId = productIds.find((id) => !excludeIds.includes(id))
  if (!availableId) throw new Error('No available products')
  return availableId
}
```

### Usage

```typescript
test('add unique product to cart', async ({ apiClass, request }) => {
  const productId = await getProductIdNotInList(request, ['prod-1', 'prod-2'])
  await apiClass.addItem(productId, 1, cartId)
})
```

## Wait Strategies

### Avoid Hard Waits

❌ **Don't**:
```typescript
await page.waitForTimeout(5000)
```

✅ **Do**:
```typescript
await expect(page.locator('.success-message')).toBeVisible()
await page.waitForURL('/account')
await page.waitForLoadState('networkidle')
```

## Common Patterns

### Authentication Setup

```typescript
// Use authenticated fixture
test('user dashboard', async ({ loginPage }) => {
  // loginPage fixture already logs in
  await expect(page).toHaveURL('/account')
})
```

### API with Authentication

```typescript
export const apiUserFixture = apiClassFixture.extend<ApiUserFixture>({
  apiHeader: async ({ apiClass, request }, use) => {
    await apiClass.loginUser(email, password)
    const header = {
      Authorization: `Bearer ${apiClass.accessToken}`,
    }
    await use(header)
  },
})
```

### Navigation Between Pages

```typescript
export class CheckoutFlow {
  constructor(private page: Page) {}

  async startCheckout(): Promise<CartPage> {
    const cartPage = new CartPage(this.page)
    await cartPage.proceedToCheckout()
    return new DeliveryPage(this.page)
  }
}
```

## Error Handling

### API Error Handling

```typescript
async createCart(): Promise<string> {
  const response = await this.request.post(`${this.baseUrl}/carts`)
  if (response.status() != 201) {
    throw new Error(
      `Failed to create cart: ${response.status()} - ${await response.text()}`
    )
  }
  const json = await response.json()
  return json.id
}
```

### Test Error Handling

```typescript
test('handle login failure', async ({ loginPage }) => {
  await loginPage.login('wrong@email.com', 'wrongpassword')
  await expect(loginPage.errorMessage).toContainText('Invalid email or password')
})
```

## Test Isolation

### Each test should be independent

✅ **Good**:
```typescript
test('add to favorites', async ({ favoritePage }) => {
  await favoritePage.goto('/')
  await favoritePage.addProductToFavorites(productId)
})
```

❌ **Bad**:
```typescript
// Depends on previous test
test('view favorites', async ({ page }) => {
  // Assumes previous test ran and added product
  await page.goto('/favorites')
})
```

## Debugging

### Enable Traces

```bash
npm run test -- --trace on
```

### Use Playwright Inspector

```bash
PWDEBUG=1 npm run test
```

### Create Screenshots on Failure

Already configured in `playwright.config.ts` to capture on failure.

## Performance Considerations

- Use `fullyParallel: true` to run tests in parallel
- Use fixtures to reuse authentication across tests
- Mock API responses when testing UI logic
- Use viewport-specific tests only when necessary
