import axios from 'axios'
import { message } from 'ant-design-vue'
import { getToken } from '@/common/utils/auth'
import router from '@/router/index'
import store from '@/store'

// 统一调用的接口地址
export var baseURL = process.env.VUE_APP_BASE_URL
// 统一登录页面的地址
export var loginUrl = process.env.VUE_APP_LOGIN_URL
// 统一回调地址
export var callbackURL = process.env.VUE_APP_CALLBACK_URL
// 统一的测试环境的clientId
export var clientId = process.env.VUE_APP_CLIENT_ID
// 统一的菜单请求地址
export var menuRequestUrl = process.env.VUE_APP_MENU_URL
// 统一提现界面请求地址
export var pandRequestUrl = process.env.VUE_APP_PAND_URL

let aFlag = true

if (process.env.NODE_ENV === 'development') {
  // baseURL = 'https://marvel-test.4009515151.com'
  // baseURL = 'http://10.39.35.34:9999'
}

const service = axios.create({
  baseURL: baseURL || process.env.VUE_APP_BASE_URL,
  withCredentials: false, // 设置是否跨域
  timeout: 15000
})

// service.defaults.headers['Accept'] = '*/*'
service.defaults.headers.get['Content-Type'] = 'application/json; charset=UTF-8'
// service.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
service.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'
// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// service.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'
// service.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'
// service.defaults.headers.post['Cookie'] = '1b5003ea-ea68-49ad-ad99-ce72241e5226'
// service.defaults.responseType = 'json'

// 请求拦截，可携带Token请求头
service.interceptors.request.use(
  config => {
    if (config.url.indexOf('/themis/admin/v2/menu') !== -1) {
      config.headers['token'] = getToken()
    } else if (config.url.indexOf('/api/v1/logout') !== -1) {
      // console.log('不设置请求头')
    } else {
      config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['token'] = getToken()
    }
    store.dispatch('app/changeSpingFn', true)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    store.dispatch('app/changeSpingFn', false)
    if (res.code !== 0 && res.code !== 200) {
      if (res.code == -2) {
        if (aFlag) {
          store.dispatch('user/noPowerFn', res.message)
          aFlag = false
        }
      } else {
        message.warning(res.message || '服务器超时', 5).then(err => {
          console.log('系统抛出错误', err)
        })
      }
      return Promise.reject(res.message || '服务器超时')
    } else {
      return res
    }
  },
  error => {
    store.dispatch('app/changeSpingFn', false)
    if (error.response == undefined || error.response == 'undefined') {
      message.error('网络异常', 4)
    }
    if (error) {
      if (error.response) {
        if (error.response.status == 401 || error.response.status == 403) {
          if (error.response.data.code == -3 || error.response.data.code == 403) {
            router.push('/401')
          } else if (error.response.data.code == 401) {
            store.dispatch('user/noPowerFn', error.response.data.message)
          }
        }
        if (error.response.status !== 200) {
          if (error.response.data.code !== 401) {
            message.error(error.response.data.message || '连接错误', 4)
          }
        }
      }
    } else {
      message.error('连接到服务器失败', 4)
    }
    return Promise.reject(error)
  }
)

export default service
