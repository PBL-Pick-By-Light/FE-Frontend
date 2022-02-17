import http from '@/services/http-common'
import { User } from '@/types'

class AuthDataService {
  // login
  login (user: User): Promise<any> {
    return http.post(
      '/auth/login',
      {
        name: user.username,
        password: user.password
      }
    ).then(response => {
      if (response.data.token) {
        const newuser = { role: response.data.role, username: user.username, token: response.data.token }
        localStorage.setItem('user', JSON.stringify(newuser))
      }
      return response
    })
      .catch(error => {
        console.error(error)
        throw error
      })
  }

  // logout
  logout (): Promise<any> {
    return http.post('/auth/logout').then(result => {
      localStorage.removeItem('user')
    }).catch(err => {
      throw err
    })
  }

  // register
  register (user: User): Promise<any> {
    return http.post('/auth/register', {
      name: user.username,
      password: user.password,
      role: 'admin'
    }).then((result) => {
      console.log('registered')
    })
      .catch((error) => {
        console.error(error)
        throw error
      })
  }
}

export default new AuthDataService()
