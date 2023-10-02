import axios, { AxiosInstance } from 'axios'
import router from './router'
import { ElMessage } from 'element-plus'

// api client
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-type': 'application/json',
  },
})

// request interceptor
apiClient.interceptors.request.use(
  config => {
    // set authorization token to request header
    const token = window.localStorage.getItem('user_token')
    if (token) config.headers['authorization'] = 'Bearer ' + token
    else router.push({ path: '/login' })
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
apiClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    let message = 'Some error occurred on server.'
    if (error.response.status == 401) {
      message = 'Please authenticate'
      ElMessage.error(message)
      router.push('/login')
      return Promise.reject(error)
    }
    if (error.response) {
      message = error.response.data.message
    }
    // show error message
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default apiClient
