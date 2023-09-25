import http from '@/http.common'

// service for http request
class HttpService {
  // login request
  login(data: any): Promise<any> {
    return http.post(`/login`, data)
  }

  // retrieve employee request
  getUsers(id: number, offset: number, limit: number, userName?: string): Promise<any> {
    const endpoint = `/users?userId=${id}&offset=${offset}&limit=${limit}&userName=${userName}`
    return http.get(endpoint)
  }

  // retrieve request
  recognize(data: any): Promise<any> {
    return http.post('/recognitions', data)
  }

  // retrieve user's recognition activities
  getRecognitionActivies(id: number, offset: number, limit: number): Promise<any> {
    return http.get(`/activities?userId=${id}&offset=${offset}&limit=${limit}`)
  }

  // retrieve user's recognized point
  getUserPoint(id: any): Promise<any> {
    return http.get(`/users/${id}/point`)
  }
}

export default new HttpService()
