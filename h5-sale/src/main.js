import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible'
import MintUI from 'mint-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import 'mint-ui/lib/style.css'

import VueResource from 'vue-resource'
import VueTouch from 'vue-touch'
import _glob from './components/methodCommon.vue'

import store from './store'
// import wx from 'weixin-js-sdk'
// window.wx = wx
// import 'social-share.js/dist/css/share.min.css'
// import 'social-share.js/dist/js/social-share.min.js'
// import 'vue-social-share/dist/client.css'
import Share from 'vue-social-share'
import 'vue-social-share/dist/client.css'
import './global.css'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(MintUI)
Vue.use(ElementUI)
Vue.use(VueTouch, {name: 'v-touch'})
Vue.use(Share)

Vue.prototype.glob = _glob
router.beforeEach((to, from, next) => {
  if (localStorage.getItem('token') === null) {
    if (to.path === '/') {
      next()
    } else if (to.path === '/proList' || to.path === '/proDetail' || to.path === '/addReceive' || to.path === '/payBack') {
      next({
        path: '/',
        query: {
          serviceCode: to.query.serviceCode,
          productId: to.query.productId
        }
      })
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
    // if (to.path === '/') {
    //   next()
    // } else {
    //   next({
    //     path: '/',
    //     query: {
    //       serviceCode: to.query.serviceCode,
    //       productId: to.query.productId
    //     }
    //   })
    // }
  }
})

// 引入自定义组件header，index.js是组件的默认入口
import Line from './components/dotLine'
Vue.use(Line)
// 引入自定义组件header，index.js是组件的默认入口
import Msg from './components/msg'
Vue.use(Msg)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
