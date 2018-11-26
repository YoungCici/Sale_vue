const product = {
  state: {
    proId: '',
    queryId: '',
    queryCode: '',
    orderId: '',
    listForm: [],
    areaId: '',
    tradeNum: '',
    addressIndex: ''
  },

  mutations: {
    SET_PROID: (state, proId) => {
      state.proId = proId
      storeLocalStore(state)
    },
    SET_ORDERID: (state, orderId) => {
      state.orderId = orderId
      storeLocalStore(state)
    },
    SET_QUERYID: (state, queryId) => {
      state.queryId = queryId
      storeLocalStore(state)
    },
    SET_QUERYCODE: (state, queryCode) => {
      state.queryCode = queryCode
      storeLocalStore(state)
    },
    SET_TRADENUM: (state, tradeNum) => {
      state.tradeNum = tradeNum
      storeLocalStore(state)
    },
    SET_LISTFORM: (state, listForm) => {
      state.listForm = listForm
      storeLocalStore(state)
    },
    SET_AREAID: (state, areaId) => {
      state.areaId = areaId
      storeLocalStore(state)
    },
    SET_ADDRESSINDEX: (state, addressIndex) => {
      state.addressIndex = addressIndex
      storeLocalStore(state)
    }
  },

  actions: {}
}

function storeLocalStore (state) {
  window.localStorage.setItem('userMsg', JSON.stringify(state))
}

export default product
