# ToolShop Test Automation - Documentation

## Project Structure Overview

- **src/pages/** - Page Object Model (POM) classes organized by domain
  - `authentication/` - Login, registration, password recovery
  - `catalog/` - Product browsing, search, filter, sort
  - `shopping/` - Cart, favorites, payment, delivery

- **src/api/** - API client classes for backend testing
  - `auth.api.ts` - Authentication endpoints
  - `cart.api.ts` - Shopping cart endpoints
  - `products.api.ts` - Product endpoints
  - `admin.api.ts` - Admin operations

- **src/fixtures/** - Reusable Playwright test fixtures
  - `pages.fixture.ts` - All page object fixtures
  - `api.fixture.ts` - Cart API fixture
  - `auth.fixture.ts` - Authenticated user fixture
  - `admin-api.fixture.ts` - Admin authenticated fixture

- **src/models/** - Data models for testing
  - `auth/` - Registration and user models
  - `shopping/` - Payment, billing, line item models

- **src/enums/** - Enumeration definitions
  - Filter options, sorting options

- **src/factories/** - Data factory patterns
  - Product factory, user factory

- **src/data/** - Test data (JSON files)
  - users.json, items.json

- **src/utils/** - Shared utilities (placeholder for expansion)

- **src/config/** - Configuration files
  - Environment setup, global setup

- **tests/** - Test files organized by type
  - `e2e/` - End-to-end tests organized by domain
  - `api/` - API tests
  - `admin/` - Admin functionality tests
  - `integration/` - Integration tests
  - `mocking/` - Mocking/mock tests

## Getting Started

See [SETUP.md](./SETUP.md) for installation and setup instructions.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture information.

## Testing Patterns

See [PATTERNS.md](./PATTERNS.md) for testing patterns and best practices.

## Dynamic Products

See [DYNAMIC_PRODUCTS.md](./DYNAMIC_PRODUCTS.md) for information about dynamic product feature.
