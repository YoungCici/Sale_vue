import request from '@/utils/request'
import store from '@/store'

// 微信分享授权获取签名凭证
export function getAuth (param) {
  return request({
    url: '/platform-extend/api/wx/authorization',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId,
      'Content-Type': 'application/json'
    },
    params: param
  })
}

// 支付宝支付订单
export function payAlipay (param) {
  return request({
    url: 'platform-order/order/payment/pay',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId
    },
    params: param
  })
}

