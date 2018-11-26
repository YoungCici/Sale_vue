<template>
  <div id="userAddress">
    <div class="user-detail">
      <input type="text" class="item-input username" placeholder="收件人姓名" v-model="form.consignee" required>
      <input type="text" class="item-input tel" placeholder="手机号码" v-model="form.phone" required>
      <!-- <div class="item-input select-area" required>
        <div class="right">
          <x-address :title="title6" v-model="form.areaId" :list='addressData' value-text-align="right"></x-address>
        </div>
        <span class="sel-icon">&gt;</span>
      </div> -->
      <textarea class="item-input address-detail" style="padding-top: 13px" v-model="form.address" placeholder="详细收货地址" required></textarea>
      <button :class="{cor: form.address === '' || form.consignee === '' || form.phone === ''}" @click="addNewAddress" class='mt-button mint-button--danger'>保存</button>
      <!--<input type="button" :class="{cor: blackPink}" value="保存" @click="addNewAddress" class='mt-button mint-button&#45;&#45;danger'>-->
      <!--<div class="to-customer">-->
        <!--<mt-button type="danger" @click="addNewAddress">保存</mt-button>-->
      <!--</div>-->
    </div>
    <!-- 提示 -->
    <div class="tips" v-show="show1">
      <div class="mask">
      <div class="msg-box">
        <div class="msg-title">温馨提示</div>
        <div class="msg-content">{{showContent}}</div>
        <div class="msg-btn" @click="showClose">确认</div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
// import { XAddress, ChinaAddressData } from 'vux'
import { XAddress, Alert } from 'vux'
import { addAddress } from '@/api/proList'
import { Toast } from 'mint-ui'
import wx from 'weixin-js-sdk'
import { getAuth } from '@/api/wechat'

export default {
  data () {
    return {
      form: {
        // areaId: [],
        consignee: '',
        phone: '',
        address: ''
      },
      addressData: [],
      show6: false,
      areas: [],
      title6: '所在地区',
      value: [],
      address: '',
      show1: false,
      showContent: ''
    }
  },
  components: {
    XAddress,
    Alert
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
            wx.onMenuShareTiFmeline({
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
      $('#userAddress').css({
        'height': $(window).height()
      })
      $(window).on('resize', function () {
        $('#userAddress').css({
          'height': $(window).height()
        })
      }).resize()
      // areaAllFind().then(res => {
      //   this.addressData = res.dataList
      // })
    },
    showClose: function () {
      this.show1 = false
    },
    // 保存
    addNewAddress: function () {
      const that = this
      // const area = that.form.areaId[2]
      const data = {
        address: that.form.address,
        // areaId: area,
        consignee: that.form.consignee,
        phone: that.form.phone,
        userId: localStorage.getItem('customerId'),
        zipCode: ''
      }
      addAddress(data).then(res => {
        if (res.code !== '200') {
          Toast({
            message: res.description,
            position: 'middle',
            duration: 5000
          })
        } else {
          that.$router.push({ path: '/otherAddress' })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  #userAddress {
    background: #f5f5f5;
    border-top: 1px solid #c0c0c0;
    font-weight: 200;
    .cor {
      background-color: #5a5a5a!important;
    }
    .user-detail {
      padding: 50px;
      width: calc(100% - 100px);
      height: 100%;
      background: #fff;
      .item-input {
        width: 100%;
        height: 180px;
        margin-bottom: 50px;
        border: 0;
        border-bottom: 1px solid #c0c0c0;
        font-size: 50px;
        color: #4c4c4c;
        outline: none;
        font-weight: 200;
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
          height: 180px;
          border: 0;
          color: #4c4c4c;
          .vux-cell-box {
            line-height: 180px;
            height: 180px;
            width: 100%;
            .weui-cell.weui-cell_access {
              display: flex;
              justify-content: space-between;
              .weui-cell__ft {
                width: 80px;
                height: 100px;
                &::after {
                  width: 30px;
                  height: 30px;
                  margin-top: -15px;
                }
              }
            }
          }
        }
      }
      .address-detail {
        resize: none;
      }
    }
    .to-customer {
      width: 90%;
      height: 150px;
      position: fixed;
      bottom: 30px;
      z-index: 888;
      .mint-button {
        width: 100%;
        height: 100%;
        border-radius: 100px;
        font-size: 65px;
        letter-spacing: 5px;
        font-weight: 200;
      }
    }
    .mt-button {
      width: calc(100% - 100px);
      height: 150px;
      line-height: 150px;
      text-align: center;
      border-radius: 100px;
      background: #ff5555;
      color: #fff;
      font-size: 65px;
      position: absolute;
      bottom: 30px;
      z-index: 111;
      letter-spacing: 5px;
      font-weight: 200;
      left: 50px;
      outline: none;
    }
    // .mint-button {
    //   width: calc(100% - 100px);
    //   height: 150px;
    //   line-height: 150px;
    //   text-align: center;
    //   box-shadow: 0px 0px 50px 0px rgba(53,53,53,0.2);
    //   border-radius: 100px;
    //   border: 2px solid #ccc;
    //   background: #ccc;
    //   color: #fff;
    //   font-size: 75px;
    //   position: absolute;
    //   bottom: 30px;
    //   z-index: 111;
    //   letter-spacing: 5px;
    // }
  }
  .tips{
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
          width: 60%;
          padding: 2%;
          height: 450px;
          background: #fff;
          border-radius: 50px;
          text-align: center;
          .msg-title {
            height: 150px;
            line-height: 150px;
            font-size: 65px;
            color: #4c4c4c;
            font-weight: bold;
          }
          .msg-content {
            height: 150px;
            font-size: 70px;
            text-align: center;
            color: #4c4c4c;
          }
          .msg-btn {
            border: 1px solid #ed7097;
            color: #fff;
            background: #ff5555;
            border-radius: 25px;
            width: 350px;
            height: 120px;
            font-size: 60px;
            text-align: center;
            line-height: 120px;
            margin-left: calc((100% - 350px) / 2);
            letter-spacing: 5px;
          }
        }
      }
    }
  .vux-popup-header.vux-1px-b {
      height: 100px;
      line-height: 100px;
      width: 100%;
      font-size: 55px;
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

