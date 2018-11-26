import axios from 'axios'
import { MessageBox } from 'element-ui'
// import qs from 'qs'
import router from '../router'
import store from '../store'
import {Indicator, Toast} from 'mint-ui'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  Indicator.open({
    text: '加载中...',
    spinnerType: 'fading-circle'
  })
  if (config.url.indexOf('/platform-message/sms/verify/create') !== -1) {
    return config
  } else if (config.url.indexOf('/platform-user/user/loginAndRegisterBySms') !== -1) {
    return config
  }
  // const reg = /\/platform-user\/user\/login/.test(config.url)
  // 判断为 非登录接口 的时候，统一在headers里面加上token
  if (localStorage.getItem('token') !== null) {
    if (localStorage.getItem('token')) {
      // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    } else if (store.getters.token) {
      // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + store.getters.token
    }
  }
  // config.data = qs.stringify(config.data)
  return config
})
// 上面的err处理函数，后面有用再加上
// error => {、
//   // console.log(123)
//   // Do something with request error
//   // for debug
//   // Promise.reject(error)
// }

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    // let newToken = response.config.headers.Authorization
    // localStorage.setItem('token', newToken)
    if (response.status !== 200) {
      // Message({
      //   message: res.description,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (response.status === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            this.$router.replace({ path: '/' })
            // location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    }
    Indicator.close()
    return res
  },
  error => {
    // router.push({path: '/'})
    // console.log('err' + error)// for debug
    // token过期处理
    const line_ = window.navigator.onLine
    if (line_ === false) {
      Toast({
        message: '网络异常，请检查网络',
        position: 'middle',
        duration: 5 * 1000
      })
    }
    if (error) {
      Indicator.close()
      if (error.response && error.response.status === 401) {
        Toast({
          message: '账号已在其他设备登录',
          position: 'middle',
          duration: 5000
        })
        if (localStorage.getItem('isUser') !== null && localStorage.getItem('isUser') === 'true') {
          router.push({path: '/', query: {serviceCode: localStorage.getItem('serviceCode'), productId: localStorage.getItem('productId')}})
        } else {
          router.push({path: '/'})
        }
      }
    }
    return Promise.reject(error.response)
  }
)

export default service
