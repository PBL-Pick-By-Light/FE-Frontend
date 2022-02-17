import axios from 'axios'

class ShelfDirectDataService {
  ipPort = '8000'

  /** receive all unused MacAddresses (Shelves) from Backend */
  getMacAddresses (ipAddress:string): Promise<any> {
    return axios.get('http://' + ipAddress.toString() + ':' + this.ipPort + '/light/getMACAddresses')
  }

  /** set LEDs for specific Shelf via Attributes with Color inHexFormat */
  setLEDsWAttributes (MacAddress:string, LEDs:number[], HexColor:string, ipAddress:string): Promise<any> {
    const payload = {
      Mac_Address: MacAddress,
      LEDs: LEDs,
      Color: HexColor
    }
    return axios.post('http://' + ipAddress + ':' + this.ipPort + '/light/setLEDs', payload)
  }

  /** set LEDs for specific Shelf via Object of Format
    *  const payload = {
          Mac_Address: MacAddress,
          LEDs: LEDs,
          Color: Color
    } */
  setLEDsWObject (payload:any, ipAddress:string): Promise<any> {
    return axios.post('http://' + ipAddress + ':' + this.ipPort + '/light/setLEDs', payload)
  }

  /** set LEDs for specific Shelf via Object of Format
   *  const payload = {
          Mac_Address: MacAddress,
          LEDs: LEDs
    } */
  // eslint-disable-next-line camelcase
  unsetLEDsWObject (payload:{ Mac_Address: string; LEDs: number[]; }, ipAddress:string): Promise<any> {
    return axios.post('http://' + ipAddress + ':' + this.ipPort + '/light/unsetLEDs', payload)
  }

  /** set Position on ESP for specific Shelf via Object of Format
   *    ShelfPosition{
          "ShelfNumber": int,
          "PositionId": int,
          "LEDs": [int]
    } */
  createPosition (ShelfPosition:any, ipAddress:string): Promise<any> {
    return axios.put('http://' + ipAddress + ':' + this.ipPort + '/light/createPosition/', ShelfPosition)
  }

  /** delete Position for specific Shelf via Object of Format
   *    ShelfPosition{
          "ShelfNumber": int,
          "PositionId": int
    } */
  deletePosition (ShelfPosition:any, ipAddress:string): Promise<any> {
    return axios.post('http://' + ipAddress + ':' + this.ipPort + '/light/getPositions', ShelfPosition)
  }

  /** create Shelf for specific Shelf via Object of Format
  *   Shelf{
        "ShelfNumber": int,
        "Mac_Address": str,
        "Positions": List[ShelfPosition] = []
  } */
  createShelf (payload:any, ipAddress:string): Promise<any> {
    return axios.put('http://' + ipAddress + ':' + this.ipPort + '/light/createShelf', payload)
  }

  getPositions (shelfNumber:number, ipAddress:string): Promise<any> {
    return axios.get('http://' + ipAddress + ':' + this.ipPort + '/light/getPositions/' + shelfNumber)
  }

  /** turnOn Position for specific Shelf via Object of Format
   *   {
   *   "ShelfNumber": int,
   *   "PositionId": int,
   *   "Color": str
} */
  turnOnPosition (payload:any, ipAddress:string): Promise<any> {
    return axios.post('http://' + ipAddress + ':' + this.ipPort + '/light/turnOn', payload)
  }

  /** turnOn Position for specific Shelf via Object of Format
   *   {
   *   "ShelfNumber": int
   *   }
  */
  deleteShelf (payload:any, ipAddress:string): Promise<any> {
    return axios.post('http://' + ipAddress + ':' + this.ipPort + '/light/deleteShelf')
  }

  turnOffAllPositions (shelfNumber :number, ipAddress:string): Promise<any> {
    return axios.post('http://' + ipAddress + ':' + this.ipPort + '/light/turnOffAll', {
      ShelfNumber: shelfNumber
    })
  }
}

export default new ShelfDirectDataService()
