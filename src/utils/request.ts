import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api',
  timeout: 1000 * 60 * 60,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token !== null)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    let message = ''
    switch (error.response.status) {
      case 400:
        message = error.response.data.message
        break
      case 401:
        message = '未授权，请重新登录(401)'
        localStorage.removeItem('token')
        break
      case 403:
        message = '拒绝访问(403)'
        break
      case 404:
        message = '请求出错(404)'
        break
      case 500:
        message = '服务器错误(500)'
        break
      default:
        message = `连接出错(${error.response.status || error.message})!`
    }

    ElMessage.error(error.response.data.message || error.message)
    return Promise.reject(error.response || error.message)
  },
)

export default service
