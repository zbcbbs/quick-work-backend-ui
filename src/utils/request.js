import axios from 'axios'
import router from '@/router/routers'
import { Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Config from '@/settings'
import Cookies from 'js-cookie'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // 接口访问地址
  timeout: Config.timeout // 请求超时时间
})

// 全局 请求拦截
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 让每个请求携带令牌
    }
    config.headers['Content-Type'] = 'application/json' // 默认的参数提交方式
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 全局 响应拦截
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.info(error.response)
    // 兼容 blob 下载出错 json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function(e) {
        const errorMsg = JSON.parse(reader.result).message
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    } else {
      let code = 0
      try {
        code = error.response.data.code
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Notification.error({
            title: '网络请求超时',
            duration: 5000
          })
          return Promise.reject(error)
        }
      }
      if (code) {
        const errorMsg = error.response.data.message // 错误提示
        if (code === 401) {
          store.dispatch('LogOut').then(() => {
            if (error.response.config.url.indexOf('login') !== -1) {
              // 登录异常
              Notification.error({
                title: errorMsg,
                duration: 3000
              })
            } else {
              // 在线超时
              Cookies.set('point', 401)
              location.reload()
            }
          })
        } else if (code === 403) {
          router.push({ path: '/401' })
        } else {
          if (errorMsg !== undefined) {
            Notification.error({
              title: errorMsg,
              duration: 5000
            })
          }
        }
      } else {
        Notification.error({
          title: '接口请求失败',
          duration: 5000
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
