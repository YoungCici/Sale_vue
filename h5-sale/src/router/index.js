// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from '../App'

import VueRouter from 'vue-router'
Vue.config.productionTip = true
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: function (resolve) {
        require(['../views/login.vue'], resolve)
      }
    }, {
      path: '/proList',
      component: function (resolve) {
        require(['../views/proList.vue'], resolve)
      }
      // beforeEnter: function (to, from, next) {
      //   // 判断当前地址是否有code
      //   let urls = window.location.href
      //   const newUrls = urls.split('?')[0] + '?' + urls.split('?')[1].split('#')[0]
      //   if (urls !== newUrls) {
      //     next({path: '/proList', query: newUrls})
      //   }
      //   next()
      // }
    }, {
      path: '/invitationNotInput',
      component: function (resolve) {
        require(['../views/invitationNotInput.vue'], resolve)
      }
    }, {
      path: '/guideDownload',
      component: function (resolve) {
        require(['../views/guideDownload.vue'], resolve)
      }
    }, {
      path: '/proDetail',
      component: function (resolve) {
        require(['../views/proDetail.vue'], resolve)
      }
    }, {
      path: '/addReceive',
      component: function (resolve) {
        require(['../views/addReceive.vue'], resolve)
      }
    }, {
      path: '/userAddress',
      component: function (resolve) {
        require(['../views/userAddress.vue'], resolve)
      }
    }, {
      path: '/otherAddress',
      component: function (resolve) {
        require(['../views/otherAddress.vue'], resolve)
      }
    }, {
      path: '/paySuccess',
      component: function (resolve) {
        require(['../views/paySuccess.vue'], resolve)
      }
    }, {
      path: '/payBack',
      component: function (resolve) {
        require(['../views/payBack.vue'], resolve)
      }
    }, {
      path: '/payFail',
      component: function (resolve) {
        require(['../views/payFail.vue'], resolve)
      }
    }, {
      path: '/downloadApp',
      component: function (resolve) {
        require(['../views/downloadApp.vue'], resolve)
      }
    }
  ]
})
