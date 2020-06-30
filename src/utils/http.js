import axios from 'axios'
import handleResponse from './httpException/index'

const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  async (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const result = handleResponse(response)
    console.log(result)
    return result
  },
  (error) => {
    return handleResponse(error.response)
  }
)

export default http
