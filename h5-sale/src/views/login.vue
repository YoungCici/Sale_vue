<template>
  <div id="login">
    <div class="title">登录</div>
    <div class="tips" v-if="isUser">
        温馨提示：请牢记<b>登录手机号</b>,客户端必须使用该手机号才能享受<b>付费服务</b>。
    </div>
    <div class="login-box">
      <form class="include">
        <div class="include-item">
          <div class="label-text">输入账号</div>
          <input type="text" placeholder="请输入登录手机号" class="label-input input-username" v-model="form.username" required  @blur='input4Change'>
        </div>
        <div class="include-item" v-show="passwordShow">
          <div class="label-text">输入密码</div>
          <input type="password" placeholder="请输入预设密码" class="label-input" v-model="form.password" required @blur="input3Change">
        </div>
        <div class="include-item" v-show="codeShow">
          <div class="label-text">输入验证码</div>
          <input type="text" class="label-input input-code" v-model="form.code" required>
          <div v-show="show" class="code" @click="getCodes">获取验证码</div>
          <div v-show="!show" class="code" @click="getCodesAgain"> <span class="timer"></span>{{count}}s重获</div>
        </div>
      </form>
      <div class="zoom"></div>
      <div class="login-btn" @click="logined">
        <div class="in" id="test">
          <span class="in-left">登录</span>
        </div>
      </div>
    </div>
    <div style="display:block;clear:both;content:''"></div>
    <div class="logo"></div>
  </div>
</template>

<script>
import { loginAndRegister, login, getCode, queryOrder } from '@/api/login'
// import { Message } from 'element-ui'
import { Toast } from 'mint-ui'
import wx from 'weixin-js-sdk'
import { getAuth } from '@/api/wechat'

export default {
  watch: {
    'form.code' () {
      const username = this.form.username
      const code = this.form.code
      if (username !== '' && code !== '') {
        $('#test').addClass('input-focus')
      } else {
        $('#test').removeClass('input-focus')
      }
    },
    'form.password' () {
      const password = this.form.password
      const username = this.form.username
      if (password !== '' && username !== '') {
        $('#test').addClass('input-focus')
      } else {
        $('#test').removeClass('input-focus')
      }
      if (password === '') {
        $('#test').removeClass('input-focus')
      }
    }
  },
  data () {
    return {
      isUser: false,
      form: {
        username: '',
        password: '',
        code: ''
      },
      // 弹框
      msg: '111',
      panelShow: false,
      sellerCode: '',
      telCode: '',
      show: true,
      timer: null,
      count: '',
      codeShow: false,
      passwordShow: false,
      appId: ''
    }
  },
  created () {
    this.$nextTick(function () {
      this.init()
      let url = window.location.href.split('#')[0]
      const query_ = this.$route.query
      if (window.location.href.indexOf('serviceCode') > -1 && window.location.href.indexOf('productId') > -1) {
        // 用户
        const shareTitle = '想要过护考，你可能需要这个……'
        const shareUrl = window.location.href.split('?')[0] + '#/downloadApp' + '?serviceCode=' + query_.serviceCode + '&productId=' + query_.productId
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
        })
      } else {
        // 销售
        const shareTitle = '想要过护考，你可能需要这个……'
        const shareUrl = window.location.href.split('?')[0] + '#/invitationNotInput'
        const shareImg = 'http://yhzj.oss-cn-shanghai.aliyuncs.com/logo.png'
        const shareDesc = '96.8%的考生都选择的备考神器，点击领取'
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
        })
      }
    })
  },
  methods: {
    init: function () {
      localStorage.setItem('appId', 'wx3f87b82554f1c806')
      // localStorage.setItem('appId', 'wxfddfb0c2b40f75d9')
      if (window.location.href.indexOf('serviceCode') > -1 && window.location.href.indexOf('productId') > -1) {
        this.isUser = true
      } else {
        if (localStorage.getItem('name') === null) {
          this.form.username = ''
          this.form.password = ''
        } else {
          this.form.username = localStorage.getItem('name')
          this.form.password = localStorage.getItem('pass')
        }
      }
      localStorage.clear()
      $('#login').css({
        'fontSize': $(window).width() / 37.5,
        'height': $(window).height()
      })
      $(window).on('resize', function () {
        $('#login').css({
          'fontSize': $(window).width() / 37.5,
          'height': $(window).height()
        })
      }).resize()
      if (window.location.href.indexOf('serviceCode') > -1 && window.location.href.indexOf('productId') > -1) {
        this.codeShow = true
      } else {
        this.passwordShow = true
      }
    },
    // 在获取验证码倒计时期间，不允许再点击
    getCodesAgain () {
      Toast({
        message: '不要重复获取验证码',
        position: 'middle',
        duration: 5000
      })
    },
    // 输入框值变化
    // 获取焦点时
    input1Change () {
      $('#test').addClass('input-focus')
    },
    input2Change () {
      const username = this.form.username
      const code = this.form.code
      if (username !== '' && code !== '') {
        $('#test').addClass('input-focus')
      } else {
        $('#test').removeClass('input-focus')
      }
    },
    // 失去焦点时
    input3Change () {
      const password = this.form.password
      const username = this.form.username
      if (password !== '' && username !== '') {
        $('#test').addClass('input-focus')
      } else {
        $('#test').removeClass('input-focus')
      }
      if (password === '') {
        $('#test').removeClass('input-focus')
      } else if (password.length < 5) {
        $('#test').removeClass('input-focus')
        Toast({
          message: '请输入正确的密码',
          position: 'middle',
          duration: 5000
        })
      }
    },
    input4Change () {
      const val = this.form.username
      if (val === '') {
        Toast({
          message: '手机号不能为空',
          position: 'middle',
          duration: 5000
        })
      } else {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
        if (reg.test(val)) {
          return true
        } else {
          Toast({
            message: '请输入正确的手机号',
            position: 'middle',
            duration: 5000
          })
        }
      }
    },
    hidePanel () {
      this.panelShow = false
    },
    getCodes: function () {
      const that = this
      that.show = false
      const TIME_COUNT = 60
      if (!that.timer) {
        that.count = TIME_COUNT
        that.show = false
        that.timer = setInterval(() => {
          if (that.count > 0 && that.count <= TIME_COUNT && (that.form.username.length !== 0)) {
            that.count--
          } else {
            that.show = true
            clearInterval(that.timer)
            that.timer = null
          }
        }, 1000)
      }
      const data = {
        phone: that.form.username,
        type: 'registerOrLogin'
      }
      getCode(data).then(res => {
        if (res.code === '200') {
          Toast({
            message: '验证码已发送，请注意查收',
            position: 'middle',
            duration: 5000
          })
        } else {
          Toast({
            message: res.description,
            position: 'middle',
            duration: 5000
          })
        }
        // that.form.code = res.info.code
        // that.telCode = res.info.code
      })
    },
    logined: function () {
      const that = this
      localStorage.setItem('appId', 'wx3f87b82554f1c806')
      // 分享链接对应的销售serviceCode
      if (window.location.href.indexOf('serviceCode') > -1 && window.location.href.indexOf('productId') > -1) {
        console.log('用户')
        if (this.form.username === '') {
          Toast({
            message: '手机号不能为空',
            position: 'middle',
            duration: 5000
          })
          return
        } else if (this.form.code === '') {
          Toast({
            message: '验证码不能为空',
            position: 'middle',
            duration: 5000
          })
          return
        } else if (this.form.code.length !== 6) {
          Toast({
            message: '请输入6位正确验证码',
            position: 'middle',
            duration: 5000
          })
          return
        } else if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(this.form.username)) {
          Toast({
            message: '请输入正确的手机号',
            position: 'middle',
            duration: 5000
          })
          return
        }
        localStorage.setItem('isUser', 'true')
        const data = {
          username: that.form.username,
          code: that.form.code,
          h5Flag: true,
          serviceCode: that.$route.query.serviceCode ? that.$route.query.serviceCode : window.location.href.split('#')[0].split('?')[1].split('&')[0].split('=')[1]
        }
        if (that.$route.query.serviceCode) {
          localStorage.setItem('serviceCode', that.$route.query.serviceCode)
        } else {
          localStorage.setItem('serviceCode', window.location.href.split('#')[0].split('?')[1].split('&')[0].split('=')[1])
        }
        if (that.$route.query.productId) {
          localStorage.setItem('productId', that.$route.query.productId)
        } else {
          localStorage.setItem('productId', window.location.href.split('#')[0].split('?')[1].split('&')[1].split('=')[1])
        }
        // console.log(that.$route.query)
        // 用户通过分享链接登录获取用户信息后，进入对应商品详情页
        loginAndRegister(data).then(res => {
          if (res.code !== '200') {
            Toast({
              message: res.description,
              position: 'middle',
              duration: 5000
            })
          } else {
            localStorage.setItem('token', res.info.token)
            const openId = res.info.openId
            const couserId = {}
            couserId.userId = res.info.id
            couserId.serviceCode = res.info.serviceCode
            couserId.token = res.info.token
            if (res.info.openId) {
              couserId.openId = res.info.openId
            }
            localStorage.setItem('couserId', JSON.stringify(couserId))
            // that.$store.state.user.userPhone = res.info.phone
            that.$store.state.user.userId = res.info.id
            // 用户登陆后，比较链接中的serviceCode与请求结果中与用户绑定的serviceCode是否一致
            // 与用户绑定销售关系的serviceCode--前者
            that.$store.state.user.serviceCode = res.info.serviceCode
            that.$store.state.user.token = res.info.token
            // 获取用户的订单状态详情
            const data2 = {
              userId: res.info.id
            }
            queryOrder(data2).then(response => {
              console.log(response)
              if (response.info && response.info.id) {
                localStorage.setItem('idOrder', response.info.id)
                console.log(response.info.address)
                if (response.info.address) {
                  that.$router.push({path: '/downloadApp'})
                } else {
                  that.$router.push({ path: '/paySuccess', query: {id: response.info.id} })
                }
              } else {
                // 为空时，用户未下单,跳入对应的商品详情页
                if (openId === null) {
                  let ua = window.navigator.userAgent.toLowerCase()
                  // 判断是否是微信端
                  if (ua.indexOf('micromessenger') >= 0) {
                    if (!res.info.openId) {
                      // 有openID不用再授权
                      const url_ = encodeURIComponent(window.location.href.split('#')[0] + '#/proDetail')
                      localStorage.setItem('appId', 'wx3f87b82554f1c806')
                      // localStorage.setItem('appId', 'wxfddfb0c2b40f75d9')
                      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + localStorage.getItem('appId') + '&redirect_uri=' + url_ + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                      // location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfddfb0c2b40f75d9&redirect_uri=' + url_ + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                    }
                  } else {
                    that.$router.push({ path: '/proDetail' })
                  }
                }
              }
            })
          }
        })
      } else {
        console.log('销售')
        // 销售登录后，进入商品列表页
        if (this.form.username === '') {
          Toast({
            message: '账号不能为空',
            position: 'middle',
            duration: 5000
          })
          return
        } else if (this.form.password === '') {
          Toast({
            message: '密码不能为空',
            position: 'middle',
            duration: 5000
          })
          return
        } else if (this.form.password.length < 6) {
          Toast({
            message: '请输入正确的密码',
            position: 'middle',
            duration: 5000
          })
          return
        } else if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(this.form.username)) {
          Toast({
            message: '请输入正确的手机号',
            position: 'middle',
            duration: 5000
          })
          return
        }
        localStorage.setItem('isUser', 'flase')
        const data = {
          username: that.form.username,
          password: that.form.password,
          h5Flag: true,
          serviceCode: ''
        }
        login(data).then(res => {
          // 把后台返回的数据存入localstorage
          if (res.code !== '200') {
            Toast({
              message: res.description,
              position: 'middle',
              duration: 5000
            })
          } else {
            if (res.code === '200') {
              localStorage.setItem('name', that.form.username)
              localStorage.setItem('pass', that.form.password)
              const userInfo = {}
              localStorage.setItem('serviceCode', res.info.serviceCode)
              userInfo.serviceCode = res.info.serviceCode
              userInfo.userId = res.info.id
              userInfo.token = res.info.token
              userInfo.openId = res.info.openId
              localStorage.setItem('userInfo', JSON.stringify(userInfo))
              // 把数据存入vuex
              that.$store.state.user.serviceCode = res.info.serviceCode
              that.$store.state.user.userId = res.info.id
              that.$store.state.user.token = res.info.token
              localStorage.setItem('token', res.info.token)
              that.$store.state.user.openId = res.info.openId
              let ua = window.navigator.userAgent.toLowerCase()
              // 判断是否是微信端
              if (ua.indexOf('micromessenger') >= 0) {
                if (!res.info.openId) {
                  // 有openID不用再授权
                  const url_ = encodeURIComponent(window.location.href.split('#')[0] + '#/proList')
                  localStorage.setItem('appId', 'wx3f87b82554f1c806')
                  // localStorage.setItem('appId', 'wxfddfb0c2b40f75d9')
                  location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + localStorage.getItem('appId') + '&redirect_uri=' + url_ + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                  // location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfddfb0c2b40f75d9&redirect_uri=' + url_ + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                }
              } else {
                that.$router.push({ path: '/proList' })
              }
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
  #login {
    width: 100%;
    min-height: 100%;
    background: url('../assets/img/beijing.png') no-repeat center;
    background-size: 100% 100%;
    font-weight: 200;
    .title {
      width: 95%;
      height: 140px;
      margin-left: 5%;
	    font-family: 'PingFang-SC-Bold';
	    font-size: 150px;
      letter-spacing: 5px;
      font-weight: bold;
	    color: #ffffff;
    }
    .tips{
      color: #fff;
      width: 90%;
      padding: 5%;
      font-size: 50px;
      height: 162.5px;
    }
    .login-box {
      width: 100%;
      height: 70%;
      position: absolute;
      top: 20%;
      .include {
      width: 70%;
      height: 70%;
      margin-left: 5%;
      background: rgba(255,255,255,0.98);
      border-radius: 20px;
      opacity: 0.98;
      padding: 10%;
      position: relative;
      .include-item {
        height: 30%;
        margin-top: 15%;
        .label-text{
        color: #999;
        font-size: 60px;
        font-family: 'PingFang-SC-Regular';
        width: 100%;
        height: 40px;
        letter-spacing: 2px;
        margin-bottom: 50px;
      }
      .label-input{
        width: 90%;
        height: 200px;
        padding: 0 5%;
        background: #f5f5f5;
        border-radius: 10px;
        outline: none;
        border: 1px solid #f5f5f5;
        color: #353535;
        font-size: 60px;
      }
      .input-code {
        padding-right: 440px;
        width: calc(100% - 480px);
      }
      .code{
          width: 400px;
          height: 150px;
          line-height: 150px;
          text-align: center;
          font-size: 60px;
          letter-spacing: 0;
          color: #999;
          background: #fff;
          border-radius: 25px;
          border: 2px solid #b2b2b2;
          position: relative;
          float: right;
          margin-right: 20px;
          margin-top: -175px;
          margin-left: 20px;
      }
      }
    }
    .zoom {
      width: 85%;
      height: 30px;
      margin-left: 7.5%;
      border-bottom-left-radius: 50px;
      border-bottom-right-radius: 50px;
      background: rgba(255,255,255,0.6);
      opacity: 0.6;
      position: relative;
    }
    .login-btn {
      position: relative;
      margin-top: -160px;
      .in {
        width: 80%;
        height: 250px;
        margin-left: 10%;
        // background: url('../assets/img/组7.png') no-repeat center;
        background: url('../assets/img/2.png') no-repeat center;
        background-size: 100% 100%;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .in-left {
          margin-left: 400px;
          color: #fff;
          font-size: 75px;
          letter-spacing: 5px;
        }
        .in-right {
          width: 75px;
          height: 50px;
          margin-right: 150px;
          background: url('../assets/img/zu5.png') no-repeat center;
          background-size: 100% 100%;
        }
      }
      .input-focus {
        width: 80%;
        height: 250px;
        margin-left: 10%;
        background: url('../assets/img/zu7.png') no-repeat center;
        // background: url('../assets/img/2.png') no-repeat center;
        background-size: 100% 100%;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    }
    .logo{
      width: 30%;
      height: 90px;
      margin-left: 35%;
      background: url('../assets/img/shuiyin.png') no-repeat center;
      background-size: 100% 100%;
      position: absolute;
      bottom: 40px;
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
