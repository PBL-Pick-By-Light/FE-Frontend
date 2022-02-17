import http from '@/services/http-common'
import { BackendPosition } from '@/types'

class PositionDataService {
  /**
   *
   * @param position = {
   *   item:item,
   *   quantity:number,
   *   shelfId: string,
   * }
   */
  create (position: BackendPosition): Promise<any> {
    return http.post('/positions/create', position)
  }

  // get All Positions
  getAll (): Promise<any> {
    return http.get('/positions/getAll')
  }

  // update Position
  updatePosition (position: BackendPosition, id:string): Promise<any> {
    return http.post('/positions/update/' + id, position)
  }

  // get Position from ItemId
  findByItemId (id: string): Promise<any> {
    return http.get('/positions/findByItemId/' + id)
  }

  delete (id :string): Promise<any> {
    return http.delete('/positions/delete/' + id)
  }
}

export default new PositionDataService()
