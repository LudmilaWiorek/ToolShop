# Architecture Guide

## Overview

ToolShop is a test automation suite for a fictional e-commerce platform built with Playwright and TypeScript, using the Page Object Model (POM) pattern.

## Directory Structure

```
src/
├── pages/              # UI Page Object Models
│   ├── base.page.ts   # Base class for all pages
│   ├── authentication/ # Auth-related pages
│   ├── catalog/        # Product catalog pages
│   └── shopping/       # Shopping flow pages
│
├── api/               # API Client Classes
│   ├── base.api.ts    # Base API client
│   ├── auth.api.ts    # Authentication API
│   ├── cart.api.ts    # Cart API
│   ├── products.api.ts# Products API
│   └── admin.api.ts   # Admin API
│
├── fixtures/          # Playwright Test Fixtures
│   ├── pages.fixture.ts      # Page object fixtures
│   ├── api.fixture.ts        # API client fixtures
│   ├── auth.fixture.ts       # Auth fixtures
│   └── admin-api.fixture.ts  # Admin API fixtures
│
├── models/            # Data Models
│   ├── auth/          # Auth models
│   └── shopping/      # Shopping models
│
├── enums/             # Enumerations
├── factories/         # Data Factories
├── data/              # Test Data (JSON)
├── utils/             # Shared Utilities
└── config/            # Configuration

tests/
├── e2e/              # End-to-End Tests
│   ├── authentication/
│   ├── catalog/
│   ├── shopping/
│   └── ui/
├── api/              # API Tests
├── admin/            # Admin Tests
├── integration/      # Integration Tests
└── mocking/          # Mocking Tests
```

## Design Patterns

### 1. Page Object Model (POM)

All UI interactions are encapsulated in page classes:

```typescript
// Example: LoginPage inherits from BasePage
export class LoginPage extends BasePage {
  readonly signInIcon: Locator
  readonly dataTestEmail: Locator

  constructor(page: Page) {
    super(page)
    // Initialize locators
  }

  async login(email: string, password: string): Promise<void> {
    // Login implementation
  }
}
```

**Benefits:**

- Centralized locators and interactions
- Easy to maintain and update
- Reusable across tests

### 2. API Client Pattern

API interactions are abstracted in API client classes:

```typescript
export class CartApi extends BaseApi {
  async createCart(): Promise<string> {
    // API request
  }

  async addItem(
    productId: string,
    quantity: number,
    cartId: string,
  ): Promise<void> {
    // Add item to cart
  }
}
```

### 3. Test Fixtures

Playwright fixtures provide reusable test setup:

```typescript
export const fixtures = baseTest.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goToPage()
    await use(loginPage)
  },
})
```

### 4. Factory Pattern

Data factories generate test data:

```typescript
export const getProductIdNotInList = async (...): Promise<string> => {
  // Generate product data
}
```

## Key Components

### Base Classes

- **BasePage** (`src/pages/base.page.ts`) - Common page operations
- **BaseApi** (`src/api/base.api.ts`) - Common API operations

### Page Organization by Domain

- **Authentication**: Login, registration, password recovery
- **Catalog**: Browse, search, filter, sort products
- **Shopping**: Cart, favorites, payment, delivery

### Test Organization

- **E2E Tests**: User journey tests for complete flows
- **API Tests**: Direct API endpoint testing
- **Admin Tests**: Admin-specific functionality
- **Integration Tests**: Inter-component integration
- **Mocking Tests**: Tests with mocked data

## Data Flow

1. **Fixtures initialize test objects** (pages, APIs, fixtures)
2. **Factories generate test data** (users, products, etc.)
3. **Models define data structures** (registration, payment, etc.)
4. **Tests use fixtures and pages/APIs** to interact with the application
5. **Assertions verify expected behavior**

## Configuration

### TypeScript Paths

Path aliases simplify imports:

```typescript
import { AuthApi } from '@api/auth.api'
import { fixtures } from '@fixtures/pages.fixture'
import { LoginPage } from '@pages/authentication/login.page'
```

### Environment Setup

- `playwright.config.ts` - Main Playwright configuration
- `src/config/global.setup.ts` - Global test setup
- `src/config/env.config` - Environment variables
- `tsconfig.json` - TypeScript configuration

## Testing Strategy

### E2E Testing

Test complete user journeys from login to purchase.

### API Testing

Test backend endpoints directly for reliability and performance.

### Component Testing

Test individual features in isolation.

### Mocking

Use mocked responses to test failure scenarios.

## Best Practices

1. **Keep tests independent** - Each test should be runnable in isolation
2. **Use meaningful assertions** - Clear expectations in tests
3. **Avoid hardcoded values** - Use factories and fixtures
4. **Organize by domain** - Group related functionality
5. **Reuse fixtures** - Minimize duplication
6. **Document complex flows** - Add comments for intricate test logic
