<template>
  <div id="proDetail">
    <div class="slider">
      <img :src="list.imgUrl" :onerror="defaultImg">
    </div>
    <div class="detail-text">
      <div class="detail-name">{{list.title}}</div>
      <div class="detail-price">￥{{list.price}}</div>
      <div class="detail-msg">
        <span class="left">2-4天内发货</span>
        <span class="center">{{list.postage === 0 ? '免运费' : ('运费：' + list.postage + '元')}}</span>
        <span class="right">已卖出{{list.buyCount}}件</span>
      </div>
    </div>
    <!-- <div class="evaluation item-text">
      <div class="item-title eva-title">
        <div class="line-red"></div>
        晒单评价({{list.comments.length}})
      </div>
      <div class="eva-content" v-for="(item,index) in list.comments" :key="index">
        <span class="username">{{item.userId}}:</span>
        {{item.content}}
      </div>
      <div class="eva-more">查看更多</div>
    </div> -->
    <div class="item-text">
      <div class="item-title pro-title">
        <div class="line-red"></div>
        商品信息
      </div>
      <div class="img-list" v-for="(item2,index2) in imgList" :key="index2">
        <img :src="item2.url">
      </div>
    </div>
    <div class="btn-group" v-show="isUser">
      <!-- <div class="btn-share" @click="wechatShare">分享</div> -->
      <div class="btn-order" @click="toOrder" style="width:100%;">
        立即下单
      </div>
    </div>
    <div class="btn-group" v-show="!isUser">
      <div class="btn-share" @click="wechatShare">
        分享下单
      </div>
      <div class="btn-order" @click="toOrder">
        代替下单
      </div>
    </div>
    <!-- 分享插件弹框 -->
    <div class="share-boxs" v-show="showShare">
      <div class="share-group">
        <div @click="toCancel"
          style="width:30px;height:30px;text-align:center;line-height:30px;float:right;margin-right:20px;margin-top:20px;font-size:16px;color:#999;border:1px solid #ccc;background:#fff;border-radius:50%;">x</div>
        <!--<baidu-Share></baidu-Share>-->
        <!-- <share :config='config'></share> -->
        <!--<div class="social-share"></div>-->
        <h6>请在微信中进行分享</h6>
      </div>
    </div>
    <!-- 付款方式 -->
    <div class="pay-option" v-show="payShow">
      <div class="mask">
        <div class="group">
          <div class="pay-show-title">
            <span class="title-left" @click="payStyle">&lt;</span>
            <span class="title-right">付款</span>
          </div>
          <div class="cell-item" @click="payWechat">
            <div class="div-cell">
              <img src="../assets/img/weixin.png" slot="icon"
                style="display:inline-block;width:30px;">
              <span>微信支付</span>
            </div>
            <div class="div-link">推荐使用</div>
          </div>
          <div class="cell-item" @click="payAlipay">
            <div class="div-cell">
              <img src="../assets/img/zhifubao.png" slot="icon" width="30px"
                style="display:inline-block;">
              <span>支付宝支付</span>
            </div>
            <div class="div-link">请在浏览器中打开网页进行支付宝支付</div>
          </div>
          <div class="pay-show-money" @click="payStyle">
            取消
          </div>
        </div>
      </div>
    </div>
    <!-- 填写代替客户下单的手机号 -->
    <div class='client-box' v-show="phoneShow">
      <ul class="client-ul">
        <li>请输入客户手机号：</li>
        <li class="li-input">
          <input type="text" class="client-input" v-model="username">
        </li>
        <li class="li-msg">
          该手机号将作为用户登录APP享受权限的唯一账号
        </li>
        <li class="li-btn">
          <mt-button type="danger" class="btn-next" @click="toCancel" style="margin-right:15px;">取消</mt-button>
          <mt-button type="danger" class="btn-next" @click="toNext">下一步</mt-button>
        </li>
      </ul>
    </div>
    <!-- 提示微信分享在微信浏览器 -->
    <div class="tips-share" v-show="tipShow">
      <div class="mask">
      <div class="msg-box">
        <div class="msg-title">温馨提示</div>
        <div class="msg-content">微信浏览器内分享请通过右上角进行。</div>
        <mt-button @click="toCancel">知道了</mt-button>
      </div>
    </div>
    <!-- 提示支付宝支付去非微信浏览器 -->
    <div class="tips-alipay" v-show="show4">
      <div class="mask">
      <div class="msg-box">
        <div class="msg-title">温馨提示</div>
        <div class="msg-content">请在浏览器中打开网页进行支付宝支付</div>
        <mt-button @click="isAdd2">知道了</mt-button>
      </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
// import { getAuth } from '@/api/wechat'
// import { createOrder, proDetailList } from '@/api/proList'
import { createOrder, proDetailList, proDetail, sellerAgents, getOpenId } from '@/api/proList'
// import { createOrder, proDetailList, proDetail, sellerAgents } from '@/api/proList'

// import axios from 'axios'
import { payAlipay, getAuth } from '@/api/wechat'
import wx from 'weixin-js-sdk'
import { Toast } from 'mint-ui'
import baiduShare from './shareBaidu.vue'
// import {commonShare, shareTitle, shareUrl, shareImg, shareDesc} from '@/utils/wechat'

export default {
  data () {
    return {
      list: [],
      show4: false,
      listId: '',
      listCode: '',
      imgList: [],
      appId: localStorage.getItem('appId'),
      // appId: 'wxfddfb0c2b40f75d9',
      timestamp: '',
      nonceStr: '',
      signature: '',
      proLists: [],
      parmse: {
        appId: localStorage.getItem('appId'),
        // appId: 'wxfddfb0c2b40f75d9',
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: '',
        paySign: ''
      },
      defaultImg: 'this.src="' + require('../assets/img/code.png') + '"',
      showShare: false,
      payShow: false,
      phoneShow: false,
      tipShow: false,
      isUser: false,
      orderId: '',
      username: '',
      wechatList: {},
      config: {},
      url: ''
    }
  },
  components: {
    'baidu-Share': baiduShare
  },
  created () {
    this.$nextTick(function () {
      this.init()
      let url = window.location.href.split('#')[0]
      if (localStorage.getItem('userInfo') !== null) {
        // 销售
        const shareTitle = '想要过护考，你可能需要这个……'
        const shareUrl = window.location.href.split('?')[0] + '?serviceCode=' + JSON.parse(localStorage.getItem('userInfo')).serviceCode + '&productId=' + localStorage.getItem('proId')
        const shareImg = 'http://yhzj.oss-cn-shanghai.aliyuncs.com/logo.png'
        const shareDesc = '99%的考生都选择了医护之家'
        let data = {
          url: url
        }
        getAuth(data).then(res => {
          const _this = this
          if (res.code === '200') {
            let data = res.info
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: localStorage.getItem('appId'), // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.signature, // 必填，签名，见附录1
              jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
            wx.ready(function () {
              wx.onMenuShareTimeline({
                title: shareTitle, // 分享标题
                link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg, // 分享图标
                success: function () {
                  // 用户确认分享后执行的回调函数
                  this.$vux.toast.text('分享成功！！！')
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                  this.$vux.toast.text('取消分享！！！')
                }
              })
              wx.onMenuShareAppMessage({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                  // 用户确认分享后执行的回调函数
                  _this.$vux.toast.text('分享成功！！！')
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                  _this.$vux.toast.text('取消分享！！！')
                }
              })
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        // 用户
        const shareTitle = '想要过护考，你可能需要这个……'
        const shareUrl = window.location.href.split('?')[0] + '#/guideDownload' + '?serviceCode=' + localStorage.getItem('serviceCode') + '&productId=' + localStorage.getItem('productId')
        const shareImg = 'http://yhzj.oss-cn-shanghai.aliyuncs.com/logo.png'
        const shareDesc = '99%的考生都选择了医护之家'
        let data = {
          url: url
        }
        getAuth(data).then(res => {
          const _this = this
          if (res.code === '200') {
            let data = res.info
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: localStorage.getItem('appId'), // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.signature, // 必填，签名，见附录1
              jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
            wx.ready(function () {
              wx.onMenuShareTimeline({
                title: shareTitle, // 分享标题
                link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg, // 分享图标
                success: function () {
                  // 用户确认分享后执行的回调函数
                  this.$vux.toast.text('分享成功！！！')
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                  this.$vux.toast.text('取消分享！！！')
                }
              })
              wx.onMenuShareAppMessage({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                  // 用户确认分享后执行的回调函数
                  _this.$vux.toast.text('分享成功！！！')
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                  _this.$vux.toast.text('取消分享！！！')
                }
              })
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },
  methods: {
    init: function () {
      if (localStorage.getItem('isUser') === 'true') {
        this.$router.replace({
          query: {
            serviceCode: localStorage.getItem('serviceCode'),
            productId: localStorage.getItem('productId')
          }
        })
      }
      this.config = {
        url: '', // 网址，默认使用 window.location.href
        source: '', // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
        title: '医护之家', // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
        description: '', // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
        image: '', // 图片, 默认取网页中第一个img标签
        sites: ['qzone', 'qq', 'weibo', 'wechat'], // 启用的站点
        disabled: ['google', 'facebook', 'twitter'], // 禁用的站点
        wechatQrcodeTitle: ' ', // 微信二维码提示文字
        wechatQrcodeHelper: ' '
      }
      const that = this
      if (localStorage.getItem('userInfo') !== null) {
        const serviceCode = JSON.parse(localStorage.getItem('userInfo')).serviceCode
        // 销售
        that.listId = localStorage.getItem('proId')
        that.listCode = serviceCode
      } else {
        // 用户
        that.isUser = true
        that.listId = localStorage.getItem('productId')
        that.listCode = localStorage.getItem('serviceCode')
        let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
        const couserId = JSON.parse(localStorage.getItem('couserId'))
        if (ua.indexOf('micromessenger') >= 0) {
          // 在微信中打开
          let urls = window.location.href
          const querys = urls.split('&').filter(data => { return data.indexOf('code') !== -1 })[0].split('=')[1]
          const datac = {
            code: querys,
            userId: couserId.userId
          }
          getOpenId(datac).then(resCode => {
            localStorage.setItem('openId', resCode.info)
          })
        }
      }
      // 分享链接对应的销售code、id与当前的比较
      // that.listId = that.$store.getters.proId === that.$store.getters.queryId ? that.$store.getters.proId : that.$store.getters.queryId
      // that.listCode = that.$store.getters.serviceCode === that.$store.getters.queryCode ? that.$store.getters.serviceCode : that.$store.getters.queryCode
      $('.cell-item').click(function () {
        that.$store.state.payText = $(this).find('.div-cell span').text()
        // that.$router.push({ path: '/addReceive' })
      })
      // 获取订单详情
      const data = {
        productId: that.listId
      }
      proDetail(data).then(res => {
        that.list = res.info
        localStorage.setItem('listForm', JSON.stringify(res.info))
        that.$store.state.product.listForm = res.info
        if (that.list.content === '') {
          that.imgList = ''
        } else {
          that.imgList = that.list.content.mediaList
        }
      })
      // 创建订单时传的格式转换
      proDetailList(that.listId).then(res => {
        // json转成jsonArray
        res.info.amount = '1'
        res.info.productId = that.listId
        delete res.info.id
        delete res.info.tenantId
        delete res.info.closeTime
        delete res.info.updateTime
        delete res.info.createTime
        delete res.info.openTime
        delete res.info.deleteTime
        const arr = []
        arr.push(res.info)
        that.proLists = JSON.stringify(arr)
      })
    },
    payStyle: function () {
      this.payShow = !this.payShow
    },
    // 取消
    toCancel: function () {
      this.showShare = false
      this.phoneShow = false
      this.tipShow = false
    },
    isAdd2: function () {
      this.showShare = false
      this.phoneShow = false
      this.show4 = false
    },
    // 立即下单
    toOrder: function () {
      const that = this
      const data = {
        address: '',
        area: '',
        areaId: '',
        buyerId: '',
        city: '',
        consignee: '',
        courierCompany: '',
        distribution: 0,
        isAgents: localStorage.getItem('userInfo') !== null ? 2 : 1,
        phone: '',
        products: that.proLists,
        province: '',
        remark: '',
        sellerId: '',
        serviceCode: that.listCode,
        trackingNumber: '',
        // userId: that.$store.getters.userId,
        userId: localStorage.getItem('userInfo') !== null ? JSON.parse(localStorage.getItem('userInfo')).userId : JSON.parse(localStorage.getItem('couserId')).userId,
        virtual: 0,
        zipCode: ''
      }
      // 判断登录时返回的serviceCode
      if (localStorage.getItem('userInfo') !== null) {
        // 有值时-销售,点击下单跳转填写信息页面
        console.log('我是销售')
        // this.payShow = !this.payShow
        // this.$router.push({ path: '/addReceive' })
        this.phoneShow = true
      } else {
        // 为空时-用户
        console.log('我是用户')
        that.payShow = !that.payShow
        createOrder(data).then(res => {
          that.orderId = res.info.id
          // 把订单编号存入全局 后面paysuccess可以用
          localStorage.setItem('idOrder', res.info.id)
        })
      }
    },
    toNext () {
      const that = this
      const value = that.username
      const data = {
        userName: value,
        serviceCode: that.listCode
      }
      if (value === null) {
        $('.li-msg').text('手机号码不能为空')
      } else {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          sellerAgents(data).then(res => {
            localStorage.setItem('customerId', res.info.id)
            // that.$store.state.user.userId = res.info.id
            if (res.info.hasSuccessOrder === true) {
              Toast({
                message: '该手机号已有该商品权限,无需重新购买',
                position: 'middle',
                duration: 5000
              })
            } else {
              that.$router.push({ path: '/addReceive' })
              that.phoneShow = false
            }
          })
        } else {
          $('.li-msg').text('请输入正确的手机号')
        }
      }
    },
    // 是否在微信浏览器判断方法
    isWeixin () {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') >= 0) {
        return true
      } else {
        return false
      }
    },
    // 微信分享
    wechatShare () {
      const that = this
      // 判断是不是微信浏览器
      let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
      if (ua.indexOf('micromessenger') >= 0) {
        // 是就弹出弹框提示用户点击右上角分享
        console.log('weixin')
        that.tipShow = true
      } else {
        Toast({
          message: '请在微信内，进行分享',
          position: 'middle',
          duration: 5000
        })
        // 不是的话就走一般分享,用share.js插件
        // console.log('not weixin')
        // that.showShare = true
        // that.config = {
        //   url: window.location.href + '?serviceCode=' + that.$store.getters.serviceCode + '&productId=' + that.$store.getters.proId,
        //   source: '',
        //   title: '',
        //   description: '',
        //   image: '',
        //   sites: ['qzone', 'qq', 'weibo', 'wechat', 'douban'],
        //   disabled: []
        // }
        // const $config = {
        //   url: window.location.href.split('#')[0] + '#/?serviceCode=' + that.$store.getters.serviceCode + '&productId=' + that.$store.getters.proId,
        //   source: '',
        //   title: '测试',
        //   description: '测试内容',
        //   image: '',
        //   sites: ['weibo', 'qzone', 'qq', 'google', 'wechat'], // 启用的站点
        //   disabled: ['facebook', 'twitter', 'douban'] // 禁用的站点
        // }
        // window.socialShare('.social-share', $config)
      }
    },
    // 微信支付
    payWechat (parmse) {
      const that = this
      // payType为2时为微信支付
      let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
      if (ua.indexOf('micromessenger') >= 0) {
        // 在微信中打开
        const data = {
          openId: localStorage.getItem('openId'),
          id: that.orderId,
          payType: 2,
          isWc: 2 // 1是浏览器支付
        }
        payAlipay(data).then(res => {
          wx.chooseWXPay({
            'timestamp': res.info.timeStamp,  // 时间戳，自1970年以来的秒数
            'nonceStr': res.info.nonceStr,  // 随机串
            'package': res.info.package,
            'signType': 'MD5',  // 微信签名方式
            'paySign': res.info.paySign, // 微信签名
            success: function (res) {
              // 支付成功后的回调函数
              that.$router.push({path: 'paySuccess'})
            }
          })
        })
      } else {
        // 非微信
        const data = {
          id: that.orderId,
          payType: 2,
          isWc: 1 // 2是微信公众号支付
        }
        payAlipay(data).then(res => {
          location.href = res.info.mweb_url
        })
      }
    },
    // 支付宝支付
    payAlipay () {
      const that = this
      let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
      if (ua.indexOf('micromessenger') >= 0) {
        // 微信
        that.payShow = false
        that.show4 = true
      } else {
        // 非微信
        const data = {
          id: that.orderId,
          payType: 1
        }
        payAlipay(data).then(res => {
          that.$store.state.user.payUrl = res.info
          // Vue中使用支付宝支付流程:点击支付宝支付调用后台接口，后台会返回一个form表单，只要在Vue里面创建新节点提交就可以唤起支付宝支付了
          const div = document.createElement('div')
          div.innerHTML = res.info // 此处就是后台返回接到from表单的数据
          document.body.appendChild(div)
          document.forms[0].submit()
        })
      }
    }
  }
}
</script>


<style lang="scss">
  #proDetail {
    background: #f5f5f5;
    width: 100%;
    min-height: 100%;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
    font-weight: 200;
    .large{
      font-size: 60px;
    }
    .slider {
      width: 100%;
      height: 630px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .detail-text {
      background: #fff;
      padding: 50px;
      padding-bottom: 0;
      .detail-name {
        color: #353535;
        font-size: 90px;
        font-weight: bold;
        padding-bottom: 50px;
      }
      .detail-price {
        color: #ff5555;
        font-size: 80px;
        padding-bottom: 50px;
      }
      .detail-msg {
        color: #999;
        font-size: 55px;
        padding-bottom: 50px;
        display: -webkit-flex;
        display: flex;
        justify-content: flex-start;
        span {
          width: calc((100% - 200px) / 3);
          height: 75px;
          &:last-child {
            text-align: right;
          }
        }
        .center {
          text-align: center;
        }
      }
    }
    .item-text {
      margin-top: 50px;
      background: #fff;
      padding: 50px;
      padding-bottom: 150px;
      .item-title {
        color: #353535;
        font-size: 70px;
        padding-bottom: 50px;
        .line-red {
          display: inline-block;
          width: 15px;
          height: 50px;
          background: #ff5555;
          border-radius: 7.5px;
          margin-right: 15px;
        }
      }
      .eva-content {
        color: #999;
        font-size: 50px;
        padding-bottom: 50px;
      }
      .eva-more {
        text-align: center;
        color: #999;
        font-size: 55px;
        height: 200px;
        line-height: 200px;
        border-top: 1px solid #f5f5f5;
      }
      .img-list {
        width: 100%;
        height: auto;
        img{
          width: 100%;
        }
      }
    }
    .btn-group {
      clear: both;
      width: 100%;
      height: 150px;
      line-height: 150px;
      color: #fff;
      text-align: center;
      font-size: 55px;
      display: -webkit-flex;
      display: flex;
      justify-content: flex-start;
      position: fixed;
      bottom: 0;
      .btn-share {
        height: 150px;
        width: 425px;
        background: rgba(255,85,85,0.7);
      }
      .btn-order {
        width: calc(100% - 425px);
        height: 150px;
        background: #ff5555;
        a {
          text-decoration: none;
          color: #fff;
        }
      }
    }
    .pay-option {
      width: 100%;
      height: 100%;
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 168;
        background: rgba(0,0,0,0.7);
        .group {
          width: calc(90% - 100px);
          height: 600px;
          padding: 0;
          margin: 0;
          top: 0;
          position: fixed;
          background: #fff;
          border-radius: 30px;
          padding: 50px;
          margin: 600px auto;
          left: 50px;
          .pay-show-title {
            font-size: 60px;
            height: 150px;
            line-height: 150px;
            text-align: center;
            display: -webkit-flex;
            display: flex;
            justify-content: flex-start;
            border-bottom: 1px solid #f5f5f5;
            .title-left {
              width: 5%;
              font-weight: 200;
            }
            .title-right {
              width: 95%;
              font-weight: bold;
              text-align: center;
            }
          }
          .cell-item {
            height: 150px;
            line-height: 150px;
            border-bottom: 1px solid #f5f5f5;
            display: -webkit-flex;
            display: flex;
            justify-content: space-between;
            .div-cell {
              height: 150px;
              line-height: 150px;
              display: -webkit-flex;
              display: flex;
              align-items: center;
              font-size: 40px;
              img {
                margin-right: 50px;
              }
            }
            .div-link {
              font-size: 35px;
            }
          }
          .pay-show-money {
            height: 150px;
            line-height: 150px;
            color: #4c4c4c;
            font-size: 60px;
            letter-spacing: 5px;
            font-weight: bold;
            text-align: center;
          }
        }
      }
    }
    .client-box {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 168;
      background: rgba(0,0,0,0.7);
      .client-ul {
        background: #fff;
        padding: 5%;
        width: 70%;
        margin: 600px auto;
        height: 550px;
        position: fixed;
        left: 10%;
        border-radius: 20px;
        li {
          list-style: none;
          font-size: 55px;
          margin-bottom: 20px;
        }
        .li-input {
          margin-top: 3px;
          margin-bottom: 20px;
          height: auto;
          input {
            border: 3px solid #ccc;
            width: calc(100% - 50px);
            padding-left: 50px;
            height: 110px;
            outline: none;
            font-size: 60px;
          }
        }
        .li-msg {
          color: #ff5555;
          font-size: 50px;
        }
        .li-btn {
          border-top: 3px solid #cecece;
          padding-top: 5%;
          display: -webkit-flex;
          display: flex;
          justify-content: center;
          .btn-next {
            font-size: 60px;
            height: 120px;
            width: 250px;
            border-radius: 20px;
          }
        }
      }
    }
    .share-boxs {
      .share-group {
        position: fixed;
        width: 80%;
        left: 10%;
        top: 35%;
        min-height: 850px;
        border-radius: 20px;
        background: #f5f5f5;
        border-radius: 15px;
        z-index: 1111;
        text-align: center;
        .social-share {
          margin-top: 180px;
          height: 250px;
          line-height: 250px;
          a{
            width: 100px;
            height: 100px;
            background: #fff;
            text-align: center;
            line-height: 100px;
            margin-left: 30px;
            font-size: 60px;
          }
        }
      }
    }
    .tips-share{
      .mask {
        background: rgba(0,0,0,0.7);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        .msg-box {
          width: 70%;
          padding: 2%;
          height: 550px;
          background: #fff;
          border-radius: 50px;
          text-align: center;
          position: fixed;
          top: 35%;
          .msg-title {
            height: 150px;
            line-height: 150px;
            font-size: 65px;
            color: #4c4c4c;
            font-weight: bold;
          }
          .msg-content {
            height: 250px;
            font-size: 55px;
            color: #4c4c4c;
          }
          .mint-button {
            border: 1px solid #ed7097;
            color: #fff;
            background: #ff5555;
            border-radius: 25px;
            width: 450px;
            height: 120px;
            font-size: 60px;
            text-align: center;
            line-height: 120px;
          }
        }
      }
    }
  }
  .el-message {
    top: 350px;
    height: auto;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 5px 30px 0 rgba(208,208,208,0.2);
    position: fixed;
    z-index: 999;
    padding: 20px;
    .el-message__img {
      width: 80px;
      height: 80px;
      float: left;
    }
    .el-message__group {
        float: left;
        width: 60%;
        height: auto;
        padding-top: 50px;
        font-size: 50px;
        color: #333;
        text-align: center;
        padding-bottom: 20px;
        margin-bottom: 30px;
        margin-left: 70px;
    }
    .el-message__closeBtn.el-icon-close {
        width: 250px;
        height: 85px;
        line-height: 85px;
        background: #f95a5c;
        font-size: 55px;
        text-align: center;
        margin-left: calc((100% - 250px) / 2);
        color: #fff;
        border: 1px solid #f95a5c;
        border-radius: 10px;
        margin-bottom: 30px;
    }
}
</style>

