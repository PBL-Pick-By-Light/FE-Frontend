import http from '@/services/http-common'

class SettingsService {
  /**
   * returns Settings as:
   * {
    "language": "61e5946e9f094278582eda5d",
    "colors": [
        "#fefefe",
        "#010101"
    ]
    }
   */
  getSettings (): Promise<any> {
    return http.get('/settings/')
  }

  /**
   *
   * @param Data needs to be provided in following Form:
   * {
    "language": "61e5946e9f094278582eda5d",
    "colors": [
        "#fefefe",
        "#010101"
    ]
    }
   */
  setSettings (Data: any): Promise<any> {
    return http.post('/settings/update', Data)
  }
}

export default new SettingsService()
