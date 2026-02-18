import { APIRequestContext } from '@playwright/test'

export class BaseApi {
  readonly request: APIRequestContext
  readonly baseUrl = 'https://api.practicesoftwaretesting.com'

  constructor(request: APIRequestContext) {
    this.request = request
  }
}
