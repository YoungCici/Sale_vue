<template>
  <div id="proList">
    <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false" :bottomLoadingText="loadingText">
      <div class="nav-back"></div>
      <div class="pro-title">商品列表</div>
      <ul class="ul-list">
        <li v-for="(item,index) in list" :key="index">
          <div class="item-div left-img">
            <img :src="item.imgUrl" :onerror="defaultImg">
          </div>
          <div class="item-div right">
            <div class="title">
              <span class="left">{{item.title}}</span>
              <span class="text-red">￥{{item.price}}</span>
            </div>
            <div class="sub">
              已售：{{item.buyCount}}
            </div>
            <div class="share-btn" @click="toDetail(item.id)">
              <span class="share-icon"></span>商品详情
            </div>
          </div>
        </li>
      </ul>
      <div style="height: 50px!important;">
      </div>
    </mt-loadmore>
    <!--<ul class="ul-list">-->
      <!--<li v-for="(item,index) in list" :key="index">-->
        <!--<div class="item-div left-img">-->
          <!--<img :src="item.imgUrl" :onerror="defaultImg">-->
        <!--</div>-->
        <!--<div class="item-div right">-->
          <!--<div class="title">-->
            <!--<span class="left">{{item.title}}</span>-->
            <!--<span class="text-red">￥{{item.price}}</span>-->
          <!--</div>-->
          <!--<div class="sub">-->
              <!--已售：{{item.buyCount}}-->
          <!--</div>-->
          <!--<div class="share-btn" @click="toDetail(item.id)">-->
            <!--<span class="share-icon"></span>商品详情-->
          <!--</div>-->
        <!--</div>-->
      <!--</li>-->
    <!--</ul>-->
    <div class="to-customer">
      <mt-button type="danger" @click="wechatShare">发展客户</mt-button>
    </div>
    <!-- 分享插件弹框 -->
    <div class="share-boxs" v-show="showShare">
      <div class="share-group">
        <div @click="toCancel"
          style="width:30px;height:30px;text-align:center;line-height:30px;float:right;margin-right:20px;margin-top:20px;font-size:16px;color:#999;border:1px solid #ccc;background:#fff;border-radius:50%;">x</div>
        <!-- <share :config='config'></share> -->
        <div class="social-share"></div>
      </div>
    </div>
    <div class="tips-share" v-show="tipShow">
      <div class="mask">
        <div class="msg-box">
          <div class="msg-title">温馨提示</div>
          <div class="msg-content">将该页面分享给好友即可完成邀请。</div>
          <div class="msg-content">微信浏览器内分享请通过右上角进行。</div>
          <mt-button @click="toCancel">知道了</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getList, proDetail, getOpenId } from '@/api/proList'
// import { getList, proDetail } from '@/api/proList'
import wx from 'weixin-js-sdk'
import { getAuth } from '@/api/wechat'
import { Toast } from 'mint-ui'
// import qs from 'qs'

export default {
  data () {
    return {
      allLoaded: false,
      appId: localStorage.getItem('appId'),
      // appId: 'wxfddfb0c2b40f75d9',
      pageSize: {
        size: 10,
        page: 1
      },
      list: [],
      defaultImg: 'this.src="' + require('../assets/img/code.png') + '"',
      showShare: false,
      tipShow: false,
      page: 2,
      loadingText: '加载中...'
    }
  },
  created () {
    this.$nextTick(function () {
      this.init()
      let url = window.location.href.split('#')[0]
      const shareTitle = '欢迎加入医护之家，老师带你超神升级轻松过护考'
      const shareUrl = window.location.href.split('?')[0] + '#/invitationNotInput' + '?serviceCode=' + JSON.parse(localStorage.getItem('userInfo')).serviceCode
      const shareImg = 'http://yhzj.oss-cn-shanghai.aliyuncs.com/logo.png'
      const shareDesc = '想要过护考，你可能需要这个……'
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
    })
  },
  methods: {
    loadBottom () {
      getList({size: 10, page: this.page}).then(response => {
        if (response.dataList.length === 0) {
          this.allLoaded = true
          Toast({
            message: '已加载全部数据',
            position: 'middle',
            duration: 5000
          })
        } else {
          this.page += 1
          this.list = this.list.concat(response.dataList)
        }
      })
      // 若数据已全部获取完毕
      // this.allLoaded = true
      this.$refs.loadmore.onBottomLoaded()
    },
    init () {
      const that = this
      let ua = window.navigator.userAgent.toLowerCase()
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (ua.indexOf('micromessenger') >= 0) {
        // 判断当前地址是否有code
        let urls = window.location.href
        const querys = urls.split('?')[1].split('#')[0].split('=')[1].split('&')[0]
        const datac = {
          code: querys,
          userId: userInfo.userId
        }
        getOpenId(datac).then(resCode => {
          localStorage.setItem('openId', resCode.info)
          that.$store.state.user.openId = resCode.info
        })
        const data = that.pageSize
        getList(data).then(response => {
          that.list = response.dataList
        })
      } else {
        const data = that.pageSize
        getList(data).then(response => {
          that.list = response.dataList
        })
      }
    },
    // 取消
    toCancel: function () {
      this.showShare = false
      this.phoneShow = false
      this.tipShow = false
    },
    toDetail (id) {
      const data = {
        productId: id
      }
      proDetail(data).then(response => {
        localStorage.setItem('proId', response.info.id)
        this.$store.state.product.proId = response.info.id
        this.$router.push({ path: '/proDetail' })
      })
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
        this.tipShow = true
        console.log('weixin')
      } else {
        Toast({
          message: '请在微信内进行分享',
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
        const $config = {
          url: window.location.href.split('#')[0] + '#/invitationNotInput?serviceCode=' + that.$store.getters.serviceCode,
          source: '',
          title: '测试',
          description: '测试内容',
          image: '',
          sites: ['weibo', 'wechat', 'qzone', 'qq', 'google'], // 启用的站点
          disabled: ['facebook', 'twitter', 'douban'] // 禁用的站点
        }
        window.socialShare('.social-share', $config)
      }
    }
  }
}
</script>

<style lang="scss">
#proList {
  padding: 0 5%;
  min-height: 100%;
  font-weight: 200;
  position: relative;
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
  .pro-title {
    font-size: 100px;
    color: #353535;
    margin-bottom: 50px;
    margin-top: 50px;
    font-weight: bold;
  }
  .ul-list {
    width: 100%;
    height: auto;
    li {
      height: auto;
      width: 100%;
      list-style: none;
      margin-bottom: 50px;
      display: -webkit-flex;
      display: flex;
      justify-content: flex-start;
      .left-img {
        width: 500px;
        height: 400px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50px;
        }
      }
      .right {
        width: calc(100% - 550px);
        margin-left: 50px;
        height: 400px;
        padding-bottom: 80px;
        border-bottom: 1px solid #ccc;
        .title {
          color: #353535;
          font-size: 55px;
          margin-bottom: 30px;
          font-weight: bold;
          display: -webkit-flex;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .text-red {
            margin-right: 0;
            color: #ff5555;
            font-size: 65px;
          }
        }
        .sub {
          color: #999;
          font-size: 55px;
          margin-bottom: 90px;
        }
        .share-btn {
          width: 100%;
          height: 120px;
          border-radius: 50px;
          border: 2px solid #ff5555;
          color: #ff5555;
          font-size: 55px;
          display: -webkit-flex;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .share-icon {
            background: url('../assets/img/detail.png') no-repeat center;
            background-size: 100% 100%;
            margin-left: 50px;
            margin-right: 30px;
            width: 65px;
            height: 55px;
          }
        }
      }
      &:last-child {
        .right {
          border-bottom: 0;
        }
      }
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
  .clear {
    display: block;
    content: '';
    clear: both;
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
