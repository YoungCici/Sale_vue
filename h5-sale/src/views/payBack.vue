<template>
  <div id="payBack">
    <div class="back-pay">
      <div class="back-icon"></div>
      <div class="back-text">支付成功</div>
    </div>
    <div class="back-msg">
      <div class="msg-item">
        订单编号：{{ orderId }}
      </div>
      <!-- <div class="msg-item">
        用户务必使用{{phone}}手机号登录
      </div>
      <div class="msg-item">
        才能享受会员权限
      </div> -->
    </div>
    <div class="back-btn" @click="toIndex">返回首页</div>
    <div class="back-msg">
      <div class="msg-item">
        <p>订单详情请在后台查看</p>
        <p>用户务必使用<b>{{ phone }}</b>手机号登录</p>
        <p>才能享受会员权限</p>
      </div>
      <!-- <div class="msg-item">
        用户务必使用{{phone}}手机号登录
      </div>
      <div class="msg-item">
        才能享受会员权限
      </div> -->
    </div>
    <div class="provide-btn" @click="toProvide">
      发展客户
    </div>
    <div class="tips-share" v-show="tipShow">
      <div class="mask">
        <div class="msg-box">
          <div class="msg-title">温馨提示</div>
          <div class="msg-content">微信浏览器内分享请通过右上角进行。</div>
          <div class="msg-content">将该页面分享给好友即可完成邀请</div>
          <mt-button @click="tipShow = false">知道了</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTradeNum } from '@/api/proList'
import wx from 'weixin-js-sdk'
import { getAuth } from '@/api/wechat'
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      phone: '',
      orderId: '',
      postNum: '',
      productName: '',
      tipShow: false
    }
  },
  created () {
    this.$nextTick(function () {
      this.init()
      let url = window.location.href.split('#')[0]
      const shareTitle = '欢迎加入护考之家,老师带你超神升级轻松过护考'
      const shareUrl = window.location.href.split('?')[0] + '#/invitationNotInput' + '?serviceCode=' + localStorage.getItem('serviceCode')
      const shareImg = 'http://yhzj.oss-cn-shanghai.aliyuncs.com/logo.png'
      const shareDesc = '96.8%的考生都选择的备考神器,点击领取'
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
            // appId: 'wxfddfb0c2b40f75d9',
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
    })
  },
  methods: {
    init () {
      // 获取地址栏支付宝返回参数，来请求获取订单号
      const tradeNum = localStorage.getItem('idOrder')
      const dataNum = {
        orderId: tradeNum
      }
      getTradeNum(dataNum).then(res => {
        this.orderId = res.info.orderId
        this.phone = res.info.userName
        this.postNum = res.info.trackingNumber
        this.productName = res.info.productName
      })
    },
    toIndex () {
      this.$router.push({ path: '/proList' })
    },
    toProvide () {
      // this.$router.push({ path: '/invitationNotInput', query: {serviceCode: JSON.parse(localStorage.getItem('userInfo')).serviceCode} })
      this.tipShow = true
      const that = this
      // 判断是不是微信浏览器
      let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
      if (ua.indexOf('micromessenger') >= 0) {
        // 是就弹出弹框提示用户点击右上角分享
        that.tipShow = true
      } else {
        Toast({
          message: '请在微信内，进行分享',
          position: 'middle',
          duration: 5000
        })
      }
    }
  }
}
</script>


<style lang="scss">
  #payBack {
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
    .back-pay {
      font-weight: 200;
      width: 100%;
      height: auto;
      padding: 100px 0;
      border-bottom: 2px solid #f5f5f5;
      text-align: center;
      .back-icon {
        background: url('../assets/img/iconfont-dui.png') no-repeat center;
        background-size: 100% 100%;
        height: 250px;
        width: 250px;
        margin: 80px 0;
        display: inline-block;
      }
      .back-text {
        width: 100%;
        height: 80px;
        font-size: 80px;
        font-weight: bold;
        color: #4c4c4c;
      }
    }
    .back-btn {
      width: 50%;
      height: 100px;
      margin: 100px 0;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 60px;
      margin-left: 25%;
      background: #ff5555;
      font-weight: 200;
      border-radius: 25px;
    }
    .back-msg {
      color: #999;
      font-size: 50px;
      width: 100%;
      text-align: center;
    }
    .provide-btn {
      width: calc(100% - 100px);
      height: 120px;
      position: absolute;
      bottom: 20px;
      left: 50px;
      border: 5px solid #ff5555;
      border-radius: 100px;
      box-shadow: 0 0 50px 0 rgba(212,0,0,0.2);
      background: #ff5555;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 65px;
      font-weight: 200;
      color: #fff;
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

