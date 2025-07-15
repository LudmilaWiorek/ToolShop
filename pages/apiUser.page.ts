import { UserModel } from '../models/registration.model'
import { APIRequestContext, APIResponse } from '@playwright/test'

// export interface Headers {
//   [key: string]: string
// }
export class ApiUser {
  readonly request: APIRequestContext
  readonly baseUrl = 'https://api.practicesoftwaretesting.com'
  private headers: { [key: string]: string } = {}

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
    if (response.status() != 200) throw new Error('Cannot log in!')
    const responseJson = JSON.parse(await response.text())
    this.headers = {
      Authorization: `Bearer ${responseJson.access_token}`,
    }
    return responseJson.access_token
  }

  async getId(): Promise<string> {
    const response = await this.request.get(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    })
    if (response.status() != 200) throw new Error('Cannot fetch user ID!')
    const responseJson = JSON.parse(await response.text())
    return responseJson.id
  }

  async deleteUser(userId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/users/${userId}`, {
      headers: this.headers,
    })
  }

  async getEmail(): Promise<string> {
    const response = await this.request.get(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    })
    if (response.status() != 200) throw new Error('Cannot fetch user email!')
    const responseJson = JSON.parse(await response.text())
    return responseJson.email
  }
  async searchUser(firstName: string): Promise<UserModel[]> {
    const response = await this.request.get(`${this.baseUrl}/users/search`, {
      headers: this.headers,
      params: {
        q: firstName,
      },
    })
    if (response.status() != 200) throw new Error('User not found!')
    const responseJson = JSON.parse(await response.text())
    return responseJson.data
  }
}
