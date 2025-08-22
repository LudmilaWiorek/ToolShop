# Dynamic Product ID Solution

This solution eliminates the need to manually update product IDs in your tests every time. Instead, your tests will automatically fetch available product IDs from the API at runtime.

## Files Created

1. **`factory/product-factory.ts`** - API-based functions for fetching product IDs
2. **`factory/product-ui-helper.ts`** - UI-based functions for extracting product IDs from web pages
3. **`tests/examples/dynamic-product-ids.spec.ts`** - Example tests showing how to use the dynamic approach

## How to Use

### For API Tests

Instead of hardcoding product IDs like this:

```typescript
// ❌ OLD WAY - Manual ID that breaks when data changes
const productId = 12345
```

Use the dynamic functions:

```typescript
// ✅ NEW WAY - Always gets a valid product ID
import {
  getMultipleProductIds,
  getProductId,
  getRandomProductId,
} from '../factory/product-factory'

const productId = await getProductId(request, apiClass.baseUrl)
const multipleIds = await getMultipleProductIds(request, apiClass.baseUrl, 5)
const randomId = await getRandomProductId(request, apiClass.baseUrl)
```

### For UI Tests

```typescript
import { ProductUIHelper } from '../factory/product-ui-helper'

const productHelper = new ProductUIHelper(page)
const productId = await productHelper.getFirstProductId()
const productIds = await productHelper.getMultipleProductIds(3)
const searchResults = await productHelper.getProductIdsBySearch('hammer', 2)
```

## Available Functions

### API Functions (`product-factory.ts`)

| Function                       | Description                        | Usage                         |
| ------------------------------ | ---------------------------------- | ----------------------------- |
| `getProductId()`               | Get the first available product ID | Single product tests          |
| `getMultipleProductIds(count)` | Get multiple product IDs           | Bulk operations               |
| `getRandomProductId()`         | Get a random product ID            | Variety in testing            |
| `getProductIdByFilter(filter)` | Get product ID by criteria         | Specific product requirements |
| `getAllProducts()`             | Get all product data               | Complex filtering needs       |

### UI Functions (`product-ui-helper.ts`)

| Function                            | Description                    | Usage                      |
| ----------------------------------- | ------------------------------ | -------------------------- |
| `getFirstProductId()`               | Get first product ID from UI   | Quick single product       |
| `getMultipleProductIds(count)`      | Get multiple IDs from listing  | Bulk UI operations         |
| `getProductIdsByCategory(category)` | Get IDs from specific category | Category-specific tests    |
| `getProductIdsBySearch(term)`       | Get IDs from search results    | Search functionality tests |
| `getRandomProductId()`              | Get random product ID          | Varied UI testing          |

## Migration Guide

### Updating Existing Tests

1. **Find hardcoded product IDs** in your tests
2. **Replace with dynamic calls** at the beginning of your test
3. **Use the fetched ID** throughout your test

Example migration:

```typescript
// Before
test('Add to favorites', async ({ request, apiClass }) => {
  const productId = 123 // ❌ Hardcoded
  // ... rest of test
})

// After
test('Add to favorites', async ({ request, apiClass }) => {
  const productId = await getProductId(request, apiClass.baseUrl) // ✅ Dynamic
  // ... rest of test
})
```

### Updating Your Current Tests

Here are some of your tests that can benefit from this approach:

1. **`tests/api/favorite.api.spec.ts`** - Already partially implemented! ✅
2. **`tests/api/cart.api.spec.ts`** - Can use `getProductId()` instead of manual API calls
3. **Any UI tests** that navigate to specific products

## Benefits

- ✅ **No more manual ID updates** - Tests get fresh IDs automatically
- ✅ **Tests work with any environment** - Staging, production, local
- ✅ **More realistic testing** - Using actual available products
- ✅ **Better test isolation** - Each test gets valid data
- ✅ **Reduced maintenance** - Less brittle tests

## Error Handling

The functions include built-in error handling:

- Validates API responses
- Throws meaningful errors if no products found
- Handles edge cases (empty responses, network issues)

## Next Steps

1. **Run the example**: `npx playwright test tests/examples/dynamic-product-ids.spec.ts`
2. **Update your existing tests** one by one using the migration guide
3. **Customize the helpers** for your specific UI selectors if needed
4. **Add more specialized functions** as your testing needs grow

This solution will save you time and make your tests much more reliable! 🎉
