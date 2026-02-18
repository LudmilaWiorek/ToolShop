import { BaseApi } from './base.api'

export class ProductsApi extends BaseApi {
  async getXItems(count: number): Promise<string[]> {
    const response = await this.request.get(`${this.baseUrl}/products/`)
    if (response.status() != 200) throw 'Cannot get items'
    const responseJson = JSON.parse(await response.text())
    count = Math.min(count, responseJson.total) // we care about total number of products

    const ids: string[] = []
    for (let i = 0; i < count; i++) {
      ids.push(responseJson.data[i].id)
    }
    return ids
  }
}
