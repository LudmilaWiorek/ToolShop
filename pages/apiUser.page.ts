import { APIRequestContext } from '@playwright/test'

export class ApiUser {
  readonly request: APIRequestContext
  readonly baseUrl = 'https://api.practicesoftwaretesting.com'

  constructor(request: APIRequestContext) {
    this.request = request
  }

  async loginUser(email: string, password: string): Promise<string> {
    const loginData = {
      email: email,
      password: password,
    }
    const response = await this.request.post(`${this.baseUrl}/users/login`, {
      data: loginData,
    })
    if (response.status() != 200) throw 'Cannot log in!'
    const responseJson = JSON.parse(await response.text())
    return responseJson.access_token
  }

  async getId(): Promise<string> {
    const response = await this.request.get(`${this.baseUrl}/users/me`)
    const responseJson = JSON.parse(await response.text())
    return responseJson.id
  }
}
