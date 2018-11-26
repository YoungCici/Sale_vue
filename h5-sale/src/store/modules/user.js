const user = {
  state: {
    payText: '',
    token: '',
    tenantId: 1,
    serviceCode: '',
    userId: '',
    userPhone: '',
    payUrl: '',
    openId: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      storeLocalStore(state)
    },
    SET_TENANTID: (state, tenantId) => {
      state.tenantId = tenantId
      storeLocalStore(state)
    },
    SET_USERPHONE: (state, userPhone) => {
      state.userPhone = userPhone
      storeLocalStore(state)
    },
    SET_PAYTEXT: (state, payText) => {
      state.payText = payText
      storeLocalStore(state)
    },
    SET_SERVICECODE: (state, serviceCode) => {
      state.serviceCode = serviceCode
      storeLocalStore(state)
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
      storeLocalStore(state)
    },
    SET_PAYURL: (state, payUrl) => {
      state.payUrl = payUrl
      storeLocalStore(state)
    },
    SET_OPENID: (state, openId) => {
      state.openId = openId
      storeLocalStore(state)
    }
  },

  actions: {
    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        // removeToken()
        resolve()
      })
    }
  }
}
function storeLocalStore (state) {
  localStorage.setItem('userMsg', JSON.stringify(state))
}
export default user
