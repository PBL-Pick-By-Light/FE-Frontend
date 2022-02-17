import http from '@/services/http-common'
import { Item } from '@/types'

class ItemDataService {
  // Route to get all Items
  getAll (): Promise<any> {
    return http.get('/items/getAll')
  }

  // Route to get Item via name
  findByName (name: string): Promise<any> {
    return http.post(`/items/findByName/${name}`)
  }

  // Route to get Item via Label
  findByLabel (label: any): Promise<any> {
    return http.post('/items/findByLabel', label)
  }

  // Route to get Item via Id
  findById (Id: any): Promise<any> {
    return http.post(`/items/findById/${Id}`)
  }

  // Route to delete an Item by Id
  delete (itemId: any): Promise<any> {
    return http.delete(`/items/delete/${itemId}`)
  }

  // Route to update an Item
  update (Item: any[]): Promise<any> {
    return http.post(`/items/update/${Item}`)
  }

  // Route to create an Item
  create (Item: any): Promise<any> {
    return http.post('/items/create', Item)
  }
}

export default new ItemDataService()
