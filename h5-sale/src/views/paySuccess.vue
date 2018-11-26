<template>
  <div id="paySuccess">
    <dot-line></dot-line>
    <div class="show-content">
      <img src="../assets/img/xuanzhong.png">
      支付成功
    </div>
    <form class="show-detail">
      <input type="text" class="item-input username" v-model="form.consignee" placeholder="收件人姓名">
      <input type="text" class="item-input tel" v-model="form.phone" placeholder="手机号码">
      <!-- <div class="item-input select-area">
        <div class="right">
          <x-address @on-shadow-change="changeVal" v-model="form.place" :title="title6" :list="addressData" placeholder="请选择地址>" :popup-style="{zIndex: 502}" value-text-align="right"></x-address>
        </div>
        <span class="left">&gt;</span>
      </div> -->
      <textarea class="item-input address-detail" v-model="form.address" placeholder="详细收货地址"></textarea>
      <textarea class="item-input address-mask" v-model="form.remark" placeholder="备注"></textarea>
    </form>
    <!-- <router-link to="/userAddress">
      <mt-button>保存</mt-button>
    </router-link> -->

    <mt-button @click="paySuccess">保存</mt-button>
  </div>
</template>

<script>
import { XAddress } from 'vux'
// import { payAddress } from '@/api/proList'
// getTradeNum
import { areaAllFind, payAddress } from '@/api/proList'
import wx from 'weixin-js-sdk'
import { getAuth } from '@/api/wechat'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      form: {
        // place: [],
        consignee: '',
        phone: '',
        address: '',
        remark: ''
      },
      addressData: [],
      show6: false,
      title6: '所在地区'
    }
  },
  components: {
    XAddress
  },
  created () {
    this.$nextTick(function () {
      this.init()
      let url = window.location.href.split('#')[0]
      const shareTitle = '想要过护考，你可能需要这个……'
      const shareUrl = window.location.href.split('?')[0] + '#/guideDownload' + '?serviceCode=' + localStorage.getItem('serviceCode')
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
    init: function () {
      // http://192.168.10.177:8131/#/paySuccess?total_amount=0.01&timestamp=2018-08-28%2015%3A31%3A16&sign=cjGoolme5EV9eL9lvmKkR9ayi4QpGKs2kyuJfiekyJVUwJfi%2BgJY%2BlScgs6GgUfaXIjkaVFzNrH5rwr1neXHCcHyAwYHjVvirnO44WWX8MqynlXGryl1Qp%2FheBBXrR76S8w9bh2ffU5jjExAUZFhtjLn4K82H%2FPVib5%2BagpIa%2FUS1Yyez9JlzyR7vuHSnJRhE7UDOSoFqpDCPF%2F2gtar%2FahVp3XGFtKrLoNiLXT4VX%2F1ZRT2fDapCJZc%2B4fjMiMzTebpOyYtul5NLGpFvu9tvvolAtvQmtrT1HX76r0DtU3MftroorLrqQHj9EZJFAhwoIAJbRfPaeG1eONU5i6Vqw%3D%3D&trade_no=2018082821001004600500439841&sign_type=RSA2&auth_app_id=2018082361162209&charset=utf-8&seller_id=2088302466867916&method=alipay.trade.wap.pay.return&app_id=2018082361162209&out_trade_no=201835441458001104&version=1.0
      // 获取地址栏支付宝返回参数，来请求获取订单号
      // const ua = navigator.userAgent.toLowerCase()
      // if (ua.indexOf('micromessenger') >= 0) {
      // } else {
      //   const tradeNum = this.$route.query.out_trade_no
      //   localStorage.setItem('tradeNum', tradeNum)
      //   this.$store.state.product.tradeNum = tradeNum
      //   const dataNum = {
      //     serialNum: tradeNum
      //   }
      //   getTradeNum(dataNum).then(res => {
      //     this.form.orderId = res.info.orderId
      //   })
      // }
      Toast({
        message: '务必准确填写邮寄地址，便于我们及时发货',
        position: 'middle',
        duration: 5000
      })
      this.form.orderId = localStorage.getItem('idOrder')
      $('#paySuccess').css({
        'height': $(window).height()
      })
      $(window).on('resize', function () {
        $('#paySuccess').css({
          'height': $(window).height()
        })
      }).resize()
      areaAllFind().then(res => {
        this.addressData = res.dataList
      })
    },
    // 获取选择区域里面的值
    // changeVal: function (ids, names) {
    //   this.form.province = names[0]
    //   this.form.city = names[1]
    //   this.form.area = names[2]
    //   this.form.areaId = ids[2]
    // },
    paySuccess: function () {
      const data = {
        address: this.form.address,
        consignee: this.form.consignee,
        phone: this.form.phone,
        instalment: 0,
        zipCode: '',
        remark: this.form.remark,
        // province: this.form.province,
        // city: this.form.city,
        // area: this.form.area,
        // areaId: this.form.areaId,
        instalmentId: 0,
        orderId: this.form.orderId
      }
      // 保存
      payAddress(data).then(res => {
        if (res.code !== '200') {
          Toast({
            message: res.description,
            position: 'middle',
            duration: 5000
          })
        } else {
          this.$router.push({ path: '/downloadApp' })
        }
      })
    }
  }
}
</script>


<style lang="scss">
  #paySuccess {
    background: #f5f5f5;
    font-weight: 200;
    .show-content {
      height: 200px;
      background: #fff;
      text-align: center;
      line-height: 200px;
      margin-bottom: 50px;
      color: #4c4c4c;
      font-size: 80px;
      font-weight: bold;
      img {
        vertical-align: middle;
      }
    }
    .show-detail {
      padding: 50px;
      width: calc(100% - 100px);
      height: 1100px;
      background: #fff;
      .item-input {
        width: 100%;
        height: 180px;
        margin-bottom: 50px;
        border: 0;
        border-bottom: 1px solid #c0c0c0;
        font-size: 50px;
        font-weight: 200;
        color: #4c4c4c;
        outline: none;
        &:last-child {
          border-bottom: 0;
        }
      }
      .select-area {
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        .right {
          width: 100%;
        .vux-cell-box {
          .weui-cell {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .weui-cell__hd {
              display: flex;
              align-items: center;
            }
            .vux-cell-primary.vux-popup-picker-select-box {
              width: 80%;
            .vux-popup-picker-select {
              width: 99%;
              height: 180px;
              display: flex;
              align-items: center;
              border: 0;
              font-size: 60px;
              color: #4c4c4c;
              span {
                display: -webkit-flex;
                display: flex;
                align-items: center;
                color: #999;
                position: absolute;
                z-index: 111;
                right: 50px;
                height: 80px;
              }
            }
            }
          }
        }
        }
        .left {
          line-height: 180px;
        }
      }
      .address-detail, .address-mask {
        resize: none;
      }
    }
    a {
      text-decoration: none;
      .mint-button {
      width: calc(100% - 100px);
      height: 150px;
      line-height: 150px;
      text-align: center;
      box-shadow: 0px 0px 50px 0px rgba(212,0,0,0.2);
      border-radius: 100px;
      border: 2px solid #ff5555;
      background: #ff5555;
      color: #fff;
      font-size: 75px;
      position: absolute;
      bottom: 30px;
      left: 50px;
      z-index: 111;
      letter-spacing: 5px;
    }
    }
    .mint-button {
      width: calc(100% - 100px);
      height: 150px;
      line-height: 150px;
      text-align: center;
      box-shadow: 0px 0px 50px 0px rgba(212,0,0,0.2);
      border-radius: 100px;
      border: 2px solid #ff5555;
      background: #ff5555;
      color: #fff;
      font-size: 65px;
      position: absolute;
      bottom: 30px;
      left: 50px;
      z-index: 111;
      letter-spacing: 5px;
      font-weight: 200;
    }
  }
  .vux-popup-picker-container{
    .vux-popup-header {
      height: 120px;
      line-height: 120px;
      font-size: 65px;
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

