<template>
  <div id="invitationNotInput">
    <div class="header"></div>
    <div class="title"></div>
    <div class="body-input">
      <input type="text" placeholder="请输入手机号" class="input-text" v-model="telNumber">
      <input type="text" class="input-code" v-model="telCode">
      <div v-show="show" class="code" @click="getCodes">获取验证码</div>
      <div v-show="!show" class="code"> <span class="timer"></span>{{count}}s重获</div>
      <input type="button" value="立即加入" class="input-btn" @click="toDown" :class="{cor: telNumber !== ''}">
    </div>
    <!-- <div class="tips" v-show="tipsShow">
      <div class="tips-text">用户短信登录失败这个用户已经存在绑定关系了哦</div>
      <mt-button type="danger" @click="toCancel">知道了</mt-button>
    </div> -->
  </div>
</template>r

<script>
import { getCode, loginAndRegister } from '@/api/login'

export default {
  data () {
    return {
      show: true,
      timer: null,
      count: '',
      telNumber: '',
      telCode: '',
      tipsShow: false
    }
  },
  created () {
    console.log(this.$route)
  },
  methods: {
    getCodes: function () {
      const that = this
      that.show = false
      const TIME_COUNT = 60
      if (!that.timer) {
        that.count = TIME_COUNT
        that.show = false
        that.timer = setInterval(() => {
          if (that.count > 0 && that.count <= TIME_COUNT && (that.telNumber.length !== 0)) {
            that.count--
          } else {
            that.show = true
            clearInterval(that.timer)
            that.timer = null
          }
        }, 1000)
      }
      const data = {
        phone: that.telNumber,
        type: 'registerOrLogin'
      }
      getCode(data).then(res => {
        // that.form.code = res.info.code
      })
    },
    toDown () {
      // const queryCode = this.$route.query.serviceCode
      if (this.$route.query.serviceCode === 'undefined') {
        // 通过H5销售发展客户进入，获取对应的销售ID，绑定关系
        const data = {
          username: this.telNumber,
          code: this.telCode,
          h5Flag: true,
          serviceCode: this.$route.query.serviceCode,
          developFlag: true
        }
        console.log(data)
        loginAndRegister(data).then(res => {
          location.href = 'http://www.yihuzhijia.cn/download.html'
        })
      } else {
        // 通过CRM的分享链接进入,获取对应的销售ID，绑定关系
        const data = {
          username: this.telNumber,
          code: this.telCode,
          h5Flag: true,
          serviceCode: this.$route.query.serviceCode,
          developFlag: true
        }
        loginAndRegister(data).then(res => {
          location.href = 'http://www.yihuzhijia.cn/download.html'
        })
      }
    },
    toCancel () {
      this.tipsShow = false
    }
  }
}
</script>

<style lang="scss">
  #invitationNotInput {
    background: #fff;
    width: 100%;
    min-height: 100%;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
    font-weight: 200;
    .cor{
      background-color: #ff7a8f!important;
    }
    .header {
      width: 100%;
      height: 600px;
      background: url('../assets/img/tuceng3.png') no-repeat center;
      background-size: 100% 100%;
    }
    .title {
      width: 70%;
      height: 150px;
      margin: 150px 15%;
      background: url('../assets/img/words.png') no-repeat center;
      background-size: 100% 100%;
    }
    .body-input {
      width: 100%;
      height: 50%;
      position: absolute;
      top: 50%;
      input {
        width: 80%;
        margin: 30px 10%;
        height: 150px;
        line-height: 80px;
        border-radius: 120px;
        outline: none;
      }
      .input-text {
        font-size: 65px;
        padding-left: 100px;
        width: calc(80% - 100px);
        border: 3px solid #d6d6d6;
        &:focus {
          box-shadow: 0 5px 30px 0 rgba(208,208,208,0.2);
        }
      }
      .input-code {
        width: calc(100% - 690px);
        padding-left: 100px;
        padding-right: 350px;
        font-size: 65px;
        border: 3px solid #d6d6d6;
        &:focus {
          box-shadow: 0 5px 30px 0 rgba(208,208,208,0.2);
        }
      }
      .code{
          width: 300px;
          height: 120px;
          line-height: 120px;
          text-align: center;
          font-size: 55px;
          letter-spacing: 0;
          color: #999;
          background: #fff;
          border-radius: 120px;
          border: 0;
          position: relative;
          float: right;
          margin-right: 130px;
          margin-top: -165px;
          margin-left: 20px;
      }
      .input-btn {
       background-color: #999;
        margin-top: 100px;
        background-blend-mode: normal, normal;
        color: #fff;
        text-align: center;
        font-size: 60px;
        border: 0;
        letter-spacing: 5px;
      }
    }
    .tips {
      position: absolute;
      z-index: 1111;
      width: calc(80% - 100px);
      margin-left: 10%;
      min-height: 400px;
      padding: 50px;
      background: #f5f5f5;
      border: 0;
      top: 650px;
      border-radius: 20px;
      text-align: center;
      .tips-text {
        font-size: 60px;
        margin-top: 80px;
      }
      .mint-button {
        width: 250px;
        height: 120px;
        border-radius: 10px;
        font-size: 60px;
        margin-top: 80px;
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
