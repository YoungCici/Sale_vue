<template>
  <div id="register">
    <div class="title">登录</div>
    <div class="tips">
        温馨提示：请牢记<b>登录手机号</b>,客户端必须使用该手机号才能享受<b>付费服务</b>。
    </div>
    <div class="login-box">
      <div class="include">
        <div class="include-item">
          <div class="label-text">输入账号</div>
          <input type="text" class="label-input">
        </div>
        <div class="include-item">
          <div class="label-text">输入验证码</div>
          <input type="text" class="label-input input-code">
          <div class="code">获取验证码</div>
          <!-- <div class="code"> <span class="timer"></span>s重获</div> -->
        </div>
      </div>
      <div class="zoom"></div>
      <div class="login-btn">
        <router-link to="./proList">
        <div class="in">
          <span class="in-left">登录</span>
          <span class="in-right"></span>
        </div>
      </router-link>
      </div>
    </div>
    <div style="display:block;clear:both;content:''"></div>
    <div class="logo"></div>
  </div>
</template>

<script>
import { loginAndRegister } from '@/api/login'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    this.$nextTick(function () {
      this.init()
    })
  },
  methods: {
    init: function () {
      $('#register').css({
        'fontSize': $(window).width() / 37.5,
        'height': $(window).height()
      })
      $(window).on('resize', function () {
        $('#register').css({
          'fontSize': $(window).width() / 37.5,
          'height': $(window).height()
        })
      }).resize()
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
    },
    logined: function () {
      const that = this
      const data = {
        username: that.form.username,
        code: '',
        h5Flag: true,
        serviceCode: ''
      }
      loginAndRegister(data).then(res => {

      })
    }
  }
}
</script>

<style lang="scss">
  #register {
    width: 100%;
    min-height: 100%;
    background: url('../assets/img/背景.png') no-repeat center;
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
        font-size: 90px;
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
      a {
        text-decoration: none;
      .in{
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
        margin-left: 200px;
        color: #fff;
        font-size: 75px;
        letter-spacing: 5px;
      }
      .in-right {
        width: 75px;
        height: 50px;
        margin-right: 150px;
        background: url('../assets/img/组5.png') no-repeat center;
        background-size: 100% 100%;
      }
    }
    }
    }
    }
    .logo{
      width: 30%;
      height: 90px;
      margin-left: 35%;
      background: url('../assets/img/医护之家水印.png') no-repeat center;
      background-size: 100% 100%;
      position: absolute;
      bottom: 40px;
    }
  }
</style>
