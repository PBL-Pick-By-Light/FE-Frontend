import http from '@/services/http-common'
import { Label } from '@/types'

class LabelDataService {
  // get all Labels
  getAll (): Promise<any> {
    return http.get('/labels/getAll')
  }

  // Route to get Label by ItemId
  getByItemId (id:string): Promise<any> {
    return http.get('/labels/getByItemId/' + id)
  }

  // Route to find Label by Label name
  findByName (name: string): Promise<any> {
    return http.get('/labels/findByName/' + name)
  }

  // Route to find label by Label Id
  findById (id:string): Promise<any> {
    return http.get('/labels/findById/' + id)
  }

  // Route to find Label by ItemId
  findLabelsByItemId (id:string): Promise<any> {
    return http.get('/labels/findByItemId/' + id)
  }

  deleteLabelByLabelId (id:string): Promise<any> {
    return http.delete('/labels/delete/' + id)
  }

  // Route to create new Label
  create (name: any[]):Promise <any> {
    return http.post('/labels/create', name)
  }
}

export default new LabelDataService()
