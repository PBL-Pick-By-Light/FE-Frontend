import axios from 'axios'
import * as data from '../../config/config.json'
const user = JSON.parse(localStorage.getItem('user')!)

const BackendIp = data.backendIP

// eslint-disable-next-line prefer-const
let instance = axios.create({
  baseURL: BackendIp,
  headers: {
    'Content-type': 'application/json'
  }
})
try {
  instance = axios.create({
    baseURL: BackendIp,
    headers: {
      Authorization: user.token,
      'Content-type': 'application/json'
    }
  })
} catch (e) {
  console.log('test')
  instance = axios.create({
    baseURL: BackendIp,
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export default instance
