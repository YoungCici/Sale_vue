<template>
  <div id="otherAddress">
    <dot-line></dot-line>
    <div class="add-content" @click="checkItem(item, index)" v-for="(item, index) in addressList" :key="index">
      <div class="add-left" :class="index === Number(indexList) ? 'on' : ''">&bull;</div>
      <div class="add-right">
        <div class="add-header">
          <div class="header-left">{{item.consignee}}</div>
          <div class="header-right">{{item.phone}}</div>
        </div>
        <div class="add-body">
          <div class="body-area" v-if='item.areaId !== null'>{{item.areaId.provinceName}}{{item.areaId.cityName}}{{item.areaId.areaName}}</div>
          <div class="body-address">{{item.address}}</div>
        </div>
      </div>
    </div>
    <router-link to="/userAddress">
      <div class="add-new">添加新地址</div>
    </router-link>
    <div style="height: 50px!important;"></div>
    <mt-button @click="goBack">确认</mt-button>
  </div>
</template>

<script>
import { addressList, getAreaList } from '@/api/proList'
import wx from 'weixin-js-sdk'
import { getAuth } from '@/api/wechat'
// import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      radioSel: '',
      addressList: [],
      areasId: [],
      areasMsg: '',
      indexList: 0,
      falg: 0
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
    init: function () {
      const that = this
      // console.log(localStorage.getItem('123') === null)
      // console.log(that.$store.getters.addressIndex)
      if (localStorage.getItem('addressIndex') === null) {
        that.indexList = 0
      } else {
        that.indexList = localStorage.getItem('addressIndex')
      }
      $('#otherAddress').css({
        'height': $(window).height()
      })
      $(window).on('resize', function () {
        $('#otherAddress').css({
          'height': $(window).height()
        })
      }).resize()
      const data = {
        // id: that.$store.getters.userId,
        id: localStorage.getItem('customerId'),
        page: 1,
        size: 10
      }
      addressList(data).then(res => {
        const arr = []
        const array = res.dataList
        array.map((items, indexs) => {
          arr.push(items)
        })
        that.addressList = arr
        const array2 = that.addressList
        array2.forEach(el => {
          if (el.areaId === null || el.areaId === '') {
            return true
          } else {
            const data2 = {
              areaId: el.areaId
            }
            getAreaList(data2).then(res => {
              that.areasId = res.info
              el.areaId = that.areasId
            })
          }
        })
      })
    },
    checkItem: function (item, index) {
      console.log(item, index)
      $('.add-content .add-left').eq(index).addClass('on')
      $('.add-content .add-left').eq(index).parents().siblings().find('.add-left').removeClass('on')
      // this.$store.state.product.addressIndex = index
      localStorage.setItem('addressIndex', index)
    },
    goBack: function () {
      this.$router.push({ path: '/addReceive' })
    }
  }
}
</script>

<style lang="scss">
#otherAddress {
  font-weight: 200;
  background: #f5f5f5;
  .add-content {
    background: #fff;
    display: -webkit-flex;
    display: flex;
    justify-content: flex-start;
    border-bottom: 3px solid #eee;
    .add-left {
      margin-left: 50px;
      margin-right: 50px;
      vertical-align: middle;
      width: 80px;
      height: 80px;
      margin-top: 120px;
      border-radius: 50%;
      background: #999;
      color: #fff;
      text-align: center;
      line-height: 90px;
      font-size: 90px;
    }
    .on {
      background: #ff5555;
    }
    .add-right {
      padding: 50px 50px 50px 0;
      color: #4c4c4c;
      width: calc(100% - 230px);
      height: 250px;
      .add-header {
        width: 100%;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        .header-left {
          font-size: 80px;
          letter-spacing: 5px;
          font-weight: bold;
        }
        .header-right {
          font-size: 50px;
        }
      }
      .add-body {
        font-size: 50px;
        .body-area {
          margin-bottom: 15px;
        }
      }
    }
  }
  a {
    text-decoration: none;
    .add-new {
    background: #fff;
    height: 150px;
    margin-top: 50px;
    width: 100%;
    text-align: center;
    line-height: 150px;
    font-size: 65px;
    color: #353535;
    margin-bottom: 170px;
  }
  }
  .mint-button {
    position: fixed;
    bottom: 20px;
    width: calc(100% - 100px);
    left: 50px;
    height: 150px;
    background: #ff5555;
    color: #fff;
    font-size: 65px;
    line-height: 150px;
    border-radius: 100px;
    box-shadow: 0px 0px 50px 0px rgba(212,0,0,0.2);
    border: 5px solid #ff5555;
    font-weight: 200;
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


