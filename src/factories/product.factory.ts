import { APIRequestContext } from '@playwright/test'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category_id: number
  brand_id: number
  is_location_offer: boolean
  is_rental: boolean
}

export interface ProductResponse {
  data: Product[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

/**
 * Fetches the first available product ID dynamically from the API
 * @param request - Playwright API request context
 * @param baseUrl - Base URL of the API
 * @returns Promise<number> - The first product ID found
 */
export async function getProductId(
  request: APIRequestContext,
  baseUrl: string,
): Promise<number> {
  const response = await request.get(`${baseUrl}/products`)
  if (!response.ok()) {
    throw new Error(
      `Failed to fetch products: ${response.status()} ${response.statusText()}`,
    )
  }

  const responseJson: ProductResponse = await response.json()

  if (!responseJson.data || responseJson.data.length === 0) {
    throw new Error('No products found in the API response')
  }

  return responseJson.data[0].id
}

/**
 * Fetches multiple product IDs dynamically from the API
 * @param request - Playwright API request context
 * @param baseUrl - Base URL of the API
 * @param count - Number of product IDs to return (default: 5)
 * @returns Promise<number[]> - Array of product IDs
 */
export async function getMultipleProductIds(
  request: APIRequestContext,
  baseUrl: string,
  count: number = 5,
): Promise<number[]> {
  const response = await request.get(`${baseUrl}/products`)
  if (!response.ok()) {
    throw new Error(
      `Failed to fetch products: ${response.status()} ${response.statusText()}`,
    )
  }

  const responseJson: ProductResponse = await response.json()

  if (!responseJson.data || responseJson.data.length === 0) {
    throw new Error('No products found in the API response')
  }

  return responseJson.data.slice(0, count).map((product) => product.id)
}

/**
 * Fetches a random product ID from the available products
 * @param request - Playwright API request context
 * @param baseUrl - Base URL of the API
 * @returns Promise<number> - A random product ID
 */
export async function getRandomProductId(
  request: APIRequestContext,
  baseUrl: string,
): Promise<number> {
  const response = await request.get(`${baseUrl}/products`)
  if (!response.ok()) {
    throw new Error(
      `Failed to fetch products: ${response.status()} ${response.statusText()}`,
    )
  }

  const responseJson: ProductResponse = await response.json()

  if (!responseJson.data || responseJson.data.length === 0) {
    throw new Error('No products found in the API response')
  }

  const randomIndex = Math.floor(Math.random() * responseJson.data.length)
  return responseJson.data[randomIndex].id
}

/**
 * Fetches a product by specific criteria (e.g., category, brand, etc.)
 * @param request - Playwright API request context
 * @param baseUrl - Base URL of the API
 * @param filter - Filter function to apply to products
 * @returns Promise<number> - The first product ID matching the criteria
 */
export async function getProductIdByFilter(
  request: APIRequestContext,
  baseUrl: string,
  filter: (product: Product) => boolean,
): Promise<number> {
  const response = await request.get(`${baseUrl}/products`)
  if (!response.ok()) {
    throw new Error(
      `Failed to fetch products: ${response.status()} ${response.statusText()}`,
    )
  }

  const responseJson: ProductResponse = await response.json()

  if (!responseJson.data || responseJson.data.length === 0) {
    throw new Error('No products found in the API response')
  }

  const filteredProduct = responseJson.data.find(filter)
  if (!filteredProduct) {
    throw new Error('No product found matching the specified criteria')
  }

  return filteredProduct.id
}

/**
 * Fetches all available products for more complex operations
 * @param request - Playwright API request context
 * @param baseUrl - Base URL of the API
 * @returns Promise<Product[]> - Array of all products
 */
export async function getAllProducts(
  request: APIRequestContext,
  baseUrl: string,
): Promise<Product[]> {
  const response = await request.get(`${baseUrl}/products`)
  if (!response.ok()) {
    throw new Error(
      `Failed to fetch products: ${response.status()} ${response.statusText()}`,
    )
  }

  const responseJson: ProductResponse = await response.json()

  if (!responseJson.data || responseJson.data.length === 0) {
    throw new Error('No products found in the API response')
  }

  return responseJson.data
}

/**
 * Finds a product ID that's not in the excluded list
 * @param request - Playwright API request context
 * @param baseUrl - Base URL of the API
 * @param excludeIds - Array of product IDs to exclude
 * @param count - Number of products to fetch to search through (default: 20)
 * @returns Promise<number> - A product ID not in the excluded list
 */
export async function getProductIdNotInList(
  request: APIRequestContext,
  baseUrl: string,
  excludeIds: number[],
  count: number = 20,
): Promise<number> {
  const productIds = await getMultipleProductIds(request, baseUrl, count)

  // Find a product not in the excluded list
  if (!productIds || productIds.length === 0) {
    throw new Error('No products available to search through')
  }
  const availableProductId = productIds.find((id) => !excludeIds.includes(id))

  // If no available product found, throw an error
  if (availableProductId === undefined) {
    throw new Error(
      'No available products found that are not in the excluded list',
    )
  }

  return availableProductId
}
