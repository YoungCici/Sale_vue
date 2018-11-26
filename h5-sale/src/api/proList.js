import request from '@/utils/request'
import store from '@/store'
// import qs from 'qs'

// 商品列表
export function getList (param) {
  return request({
    url: '/platform-order/product/wechat/list',
    method: 'post',
    headers: {
      'tenantId': 1,
      'Content-Type': 'application/json'
    },
    params: param
  })
}

// 获取微信支付参数openId
export function getOpenId (param) {
  return request({
    method: 'post',
    url: '/platform-user/user/getWxOpenId',
    headers: {
      'tenantId': 1,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: param
  })
}

// 商品列表详情-根据商品id
export function proDetail (param) {
  return request({
    url: '/platform-order/product/wechat/detail',
    method: 'post',
    headers: {
      'tenantId': 1,
      token: localStorage.getItem('token')
    },
    params: param
  })
}

// 商品列表详情列表-根据商品id
export function proDetailList (param) {
  return request({
    url: '/platform-order/product/' + param,
    method: 'get',
    headers: {
      'tenantId': 1,
      'Content-Type': 'application/json'
    }
  })
}

// 创建订单
export function createOrder (param) {
  return request({
    url: '/platform-order/order/createorder',
    method: 'post',
    headers: {
      'tenantId': 1,
      'Content-Type': 'application/json'
    },
    data: param
  })
}

// 查询区域---顶级
export function areaAll () {
  return request({
    url: '/platform-content/codeArea/findRegion',
    method: 'get',
    headers: {
      'tenantId': 1,
      'Content-Type': 'application/json'
    }
  })
}

// 查询区域数据-所有级别数据
export function areaAllFind () {
  return request({
    url: '/platform-content/codeArea/all/find',
    method: 'get',
    headers: {
      'tenantId': store.getters.tenantId,
      'Content-Type': 'application/json'
    }
  })
}

// 查询区域---顶级的下级，即获取城市或区域列表
export function areaNextAll (param) {
  return request({
    url: '/platform-content/codeArea/findByProvinceAndType',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId,
      'Content-Type': 'application/json'
    },
    params: param
  })
}

// 新增用户收货地址
export function addAddress (param) {
  return request({
    url: 'platform-order/user/address/insertNew',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId,
      'Content-Type': 'application/json'
    },
    data: param
  })
}

// 根据用户获取地址列表
export function addressList (param) {
  return request({
    url: 'platform-order/user/address/list/user',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId
    },
    params: param
  })
}

// 根据areaId查询显示地址区域信息
export function getAreaList (param) {
  return request({
    url: 'platform-content/codeArea/findByAreaId',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId
    },
    params: param
  })
}

// 支付成功后补填地址
export function payAddress (param) {
  return request({
    url: 'platform-order/order/update/orderInfo',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId,
      'Content-Type': 'application/json'
    },
    data: param
  })
}

// 根据支付宝返回的out_trade_no获取订单号
export function getTradeNum (param) {
  return request({
    // url: 'platform-order/api/order/payment/findOrderPaymentBySerialNum',
    url: 'platform-order/api/order/payment/findOrderPaymentByOrderId',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId
    },
    params: param
  })
}

// 销售代用户注册
export function sellerAgents (param) {
  return request({
    url: 'platform-user/user/registerAgents',
    method: 'post',
    headers: {
      'tenantId': store.getters.tenantId
    },
    params: param
  })
}
