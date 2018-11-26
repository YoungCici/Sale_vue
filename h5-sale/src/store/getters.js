const getters = {
  token: state => state.user.token,
  tenantId: state => state.user.tenantId,
  serviceCode: state => state.user.serviceCode,
  userId: state => state.user.userId,
  userPhone: state => state.user.userPhone,
  payUrl: state => state.user.payUrl,
  openId: state => state.user.openId,
  proId: state => state.product.proId,
  orderId: state => state.product.orderId,
  queryId: state => state.product.queryId,
  queryCode: state => state.product.queryCode,
  tradeNum: state => state.product.tradeNum,
  listForm: state => state.product.listForm,
  areaId: state => state.product.areaId,
  addressIndex: state => state.product.addressIndex
}
export default getters
