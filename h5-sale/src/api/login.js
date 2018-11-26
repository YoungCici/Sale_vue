import request from '@/utils/request'
import store from '@/store'

// 短信登录注册
export function loginAndRegister (param) {
  return request({
    url: '/platform-user/user/loginAndRegisterBySms',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId,
      'Content-Type': 'application/json'
    },
    params: param
  })
}

// 密码登录
export function login (param) {
  return request({
    url: '/platform-user/user/login',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId,
      'Content-Type': 'application/json'
    },
    params: param
  })
}

// 获取短信验证码
export function getCode (param) {
  return request({
    url: '/platform-message/sms/verify/create',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId,
      'Content-Type': 'application/json'
    },
    data: param
  })
}

// 查询H5用户成功订单---用于用户登录是判断下一步流程
export function queryOrder (param) {
  return request({
    url: 'platform-order/order/query/wechat/sucOrder',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId
    },
    params: param
  })
}
