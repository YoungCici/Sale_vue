<template>
  <div id="payBack">
    <div class="back-pay">
      <div class="back-icon"></div>
      <div class="back-text">
        <div class="text-item">
          您已获的医护之家<b>{{ productName}}</b>权限
        </div>
        <div class="text-item">
          快去下载<b>医护之家APP</b>开始学习吧
        </div>
        <div class="text-item">
          记得一定要使用该手机号<b>{{ phone }}</b>登录
        </div>
      </div>
    </div>
    <div class="back-btn" @click="toDownApp">下载APP</div>
    <div class="back-msg">
      <div class="msg-item">
        订单号：{{ orderId }}
      </div>
      <div class="msg-item">
        暂未发货,请联系客服获取邮寄单号
      </div>
    </div>
  </div>
</template>

<script>
import { getTradeNum } from '@/api/proList'
import wx from 'weixin-js-sdk'
import { getAuth } from '@/api/wechat'

export default {
  data () {
    return {
      phone: '',
      orderId: '',
      postNum: '',
      productName: ''
    }
  },
  created () {
    this.$nextTick(function () {
      this.init()
      let url = window.location.href.split('#')[0]
      const shareTitle = '想要过护考，你可能需要这个……'
      const shareUrl = window.location.href.split('?')[0] + '#/invitationNotInput' + '?serviceCode=' + localStorage.getItem('serviceCode')
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
    toDownApp () {
      location.href = 'http://www.yihuzhijia.cn/download.html'
      // this.$router.push({ path: '/guideDownload' })
    }
  }
}
</script>


<style lang="scss">
  #payBack {
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
        height: auto;
        line-height: 100px;
        font-size: 60px;
        font-weight: 200;
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
      font-size: 55px;
      margin-left: 25%;
      background: #ff5555;
      border-radius: 85px;
      box-shadow: 0 0 50px 0 rgba(212,0,0,0.2);
      border: 5px solid #ff5555;
      font-weight: 200;
    }
    .back-msg {
      color: #999;
      font-size: 50px;
      width: 100%;
      text-align: center;
      font-weight: 200;
      .msg-item {
        width: 60%;
        margin-left: 20%;
        text-align: left;
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

