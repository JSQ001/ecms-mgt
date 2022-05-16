/* eslint-disable */
// @ts-ignore
import axios from 'axios'
import { message } from 'ant-design-vue'
import { store } from '@/store'

const { global_config } = window as any

const service = axios.create({
  baseURL: global_config.BASE_URL, // url = common-layout url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 5, // request timeout
  headers: {
    'Content-Type': 'application/json;'
  }
})

// request interceptor
service.interceptors.request.use(
  (config: any) => {
    if (store.token) {
      config.headers['Authorization'] = 'Bearer ' + store.token
    } //ey

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    //
    // }
    // console.log(config)
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      message.error(res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      if (res.data != null && res.data.error != undefined) {
        message.error(res.data.error || 'Error')
        return Promise.reject(new Error(res.data.error || 'Error'))
      } else {
        return response
      }
    }
  },
  (error) => {
    message.error(error.message || error.data.error || 'error')
    //
    // message({
    //     message: error.message || error.data.message || 'error',
    //     type: 'error',
    //     duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

// @ts-ignore
export default service
