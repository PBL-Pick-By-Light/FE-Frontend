import http from '@/services/http-common'

class ShelvesDataService {
  // Create a Shelf
  create (payload: any): Promise<any> {
    console.log('SHELFCREATE')
    console.log(payload)
    return http.post('/shelves/create', payload)
  }

  // updates the shelf
  update (Id: any): Promise<any> {
    return http.post(`/shelves/update/${Id}`)
  }

  // get All shelves
  getAll (): Promise<any> {
    return http.get('/shelves/getAll')
  }

  // delete a shelf with Id
  delete (Id: any): Promise<any> {
    return http.post(`/shelves/delete/${Id}`)
  }
}

export default new ShelvesDataService()
