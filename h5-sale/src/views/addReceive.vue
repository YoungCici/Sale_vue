<template>
  <div id="addReceive">
    <dot-line></dot-line>
    <div class="add-address">
      <div class="add-div">
      <div class="position-icon">
        <img src="../assets/img/dingwei.png">
      </div>
      <div class="address-add" v-show="addressShow" @click="toAddAddress">添加收货地址</div>
      <div class="address-content" v-if="i === Number(indexChangeVal)" v-show="!addressShow" v-for="(o, i) in addressList" :key="i">
        <div class="add-title">{{o.consignee}}</div>
        <div class="add-text" style="padding-right:0px" v-if="o.areaId !== null">
          <span>{{o.areaId.provinceName}}</span><span>{{o.areaId.cityName}}</span><span>{{o.areaId.areaName}}</span>
          <span>{{o.address}}</span>
        </div>
        <div class="add-text" style="padding-right:0px" v-else>
          <span>{{o.address}}</span>
        </div>
        <div class="add-bottom">
          <div class="add-tel">{{o.phone}}</div>
          <div class="add-other" @click="toOther">其它地址 &gt;</div>
        </div>
      </div>
    </div>
    </div>
    <dot-line></dot-line>
    <div class="clear"></div>
    <div class="add-text">
      <div class="item-input">
        <span class="input-left">付款方式</span>
        <span class="input-right pay-style" @click="payStyle">
          <div class="style-right">
            <cell v-model="payText"></cell>
            <span>&gt;</span>
          </div>
        </span>
      </div>
      <div class="item-input">
        <span class="input-left">快递费用</span>
        <span class="input-right">{{list.postage}}</span>
      </div>
      <div class="img-text">
        <div class="img-left">
          <img :src="list.imgUrl">
        </div>
        <div class="img-right">
          <div class="img-name">{{list.title}}</div>
          <div class="img-count">总计：￥{{list.price}}</div>
          <div class="img-score">使用积分：{{list.point}}</div>
        </div>
      </div>
    </div>
    <div class="item-remark">
      <textarea class="text-remark" placeholder="备注" v-model="remark"></textarea>
    </div>
    <div class="pay-btn">
      <div>
        您需要支付：￥{{list.price + list.postage}}<span>（含运费）</span>
      </div>
      <mt-button type="danger" @click="toOrder">确认</mt-button>
      <!-- <router-link to="/userAddress">
        <mt-button type="danger">确认</mt-button>
      </router-link> -->
      <!-- <router-link to="/paySuccess">
        <mt-button type="danger">确认</mt-button>
      </router-link> -->
    </div>
    <!-- 提示填写收货地址 -->
    <div class="tips" v-show="show1">
      <div class="mask">
      <div class="msg-box">
        <div class="msg-title">温馨提示</div>
        <div class="msg-content">
          <p>您还没有设置收货地址,</p>
          <p>请添加收货地址。</p>
        </div>
        <mt-button @click="isAdd2">确认添加</mt-button>
      </div>
    </div>
    </div>
    <!-- 付款方式 -->
    <div class="pay-option" v-show="show2">
      <div class="mask">
        <group class="group">
          <cell class="pay-show-title" align-items="center">
            <span class="title-left" @click="payStyle">&lt;</span>
            <span class="title-right">付款方式</span>
          </cell>
          <cell class="cell-item">
            <div class="div-cell">
              <img src="../assets/img/zhifubao.png" slot="icon" width="30px"
                style="display:inline-block;">
              <span>支付宝支付</span>
            </div>
            <div class="div-link">&gt;</div>
          </cell>
          <cell class="cell-item">
            <div class="div-cell">
              <img src="../assets/img/weixin.png" slot="icon" width="30px"
                style="display:inline-block;">
              <span>微信支付</span>
            </div>
            <div class="div-link">&gt;</div>
          </cell>
       </group>
      </div>
    </div>
    <!-- 确认支付 -->
    <div class="pay-order" v-show="show3">
      <div class="mask1">
        <group class="group1">
          <cell class="pay-show-title" align-items="center">
            <span class="title-left" @click="paySure">&lt;</span>
            <span class="title-right">付款</span>
          </cell>
          <cell class="cell-item1">
            <div class="div-cell" @click="payAli">
              <img src="../assets/img/zhifubao.png" slot="icon" width="30px"
                style="display:inline-block;">
              <span>支付宝支付</span>
            </div>
            <div class="div-link">&gt;</div>
          </cell>
          <cell class="cell-item1">
            <div class="div-cell" @click="payWechat">
              <img src="../assets/img/weixin.png" slot="icon" width="30px"
                style="display:inline-block;">
              <span>微信支付</span>
            </div>
            <div class="div-link">&gt;</div>
          </cell>
          <cell :value="payCount" class="pay-show-money">
            支付金额: <span class="text-red">￥{{list.price + list.postage}}</span>
          </cell>
       </group>
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
</template>

<script>
import { Cell, CellBox, Group } from 'vux'
import { addressList, sellerAgents, getAreaList, createOrder, proDetailList } from '@/api/proList'
import { payAlipay, getAuth } from '@/api/wechat'
import wx from 'weixin-js-sdk'

export default {
  data () {
    return {
      // payText: this.$store.state.payText,
      payText: '微信支付',
      userName: '',
      userId: '',
      payCount: '',
      addressShow: 'true',
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      addressList: [],
      list: [],
      indexChangeVal: 0,
      form: {},
      proLists: [],
      orderId: '',
      listId: [],
      remark: ''
    }
  },
  components: {
    Cell,
    CellBox,
    Group
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
      that.listId = localStorage.getItem('proId')
      that.list = JSON.parse(localStorage.getItem('listForm'))
      if (localStorage.getItem('addressIndex') !== null) {
        that.indexChangeVal = localStorage.getItem('addressIndex')
      }
      $('.cell-item').click(function () {
        that.payText = $(this).find('.weui-cell__ft span').text()
        let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
        if (ua.indexOf('micromessenger') >= 0 && (that.payText === '支付宝支付')) {
          that.show4 = true
          that.$store.state.payText = that.payText
        } else {
          that.$store.state.payText = that.payText
        }
        $('.pay-option').toggle()
      })
      $('#addReceive').css({
        'min-height': $(window).height(),
        'height': 'auto'
      })
      $(window).on('resize', function () {
        $('#addReceive').css({
          'min-height': $(window).height(),
          'height': 'auto'
        })
      }).resize()
      const data = {
        id: localStorage.getItem('customerId'),
        page: 1,
        size: 10
      }
      addressList(data).then(res => {
        const arr = []
        const array = res.dataList
        array.map((item, index) => {
          if (Number(that.indexChangeVal) === index) {
            that.form.address = item.address
            that.form.consignee = item.consignee
            that.form.phone = item.phone
            if (item.areaId !== null) {
              that.areaId = item.areaId
              getAreaList({areaId: item.areaId}).then(res => {
                item.areaId = res.info
                that.form.province = res.info.provinceName
                that.form.city = res.info.cityName
                that.form.area = res.info.areaName
                that.form.areaId = res.info.areaId
              })
            }
          }
          arr.push(item)
        })
        that.addressList = arr
        if (that.addressList.length === 0) {
          that.addressShow = true
        } else {
          that.addressShow = false
        }
        // const array2 = that.addressList
        // array2.forEach(el => {
        //   const data2 = {
        //     areaId: el.areaId
        //   }
          // getAreaList(data2).then(res => {
          //   that.areasId = res.info
          //   el.areaId = that.areasId
          //   that.form.province = res.info.provinceName
          //   that.form.city = res.info.cityName
          //   that.form.area = res.info.areaName
          //   that.form.areaId = res.info.areaId
          // })
        // })
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
    // 下单
    toOrder: function () {
      if (this.addressList.length === 0) {
        this.show1 = true
        this.show2 = false
        this.show3 = false
      } else {
        this.show1 = false
        this.show2 = false
        this.show3 = true
      }
      if (this.addressList.length !== 0) {
        const data = {
          address: this.form.address,
          area: this.form.area,
          areaId: this.form.areaId,
          city: this.form.city,
          consignee: this.form.consignee,
          distribution: 0,
          // isAgents: this.$store.getters.serviceCode === '' ? 1 : 2,
          isAgents: JSON.parse(localStorage.getItem('userInfo')).serviceCode === '' ? 1 : 2,
          phone: this.form.phone,
          products: this.proLists,
          province: this.form.province,
          remark: this.remark,
          // serviceCode: this.$store.getters.serviceCode,
          serviceCode: JSON.parse(localStorage.getItem('userInfo')).serviceCode,
          // userId: this.$store.getters.userId,
          userId: localStorage.getItem('customerId'),
          virtual: 0,
          wechatFlag: 2,
          zipCode: ''
        }
        createOrder(data).then(res => {
          this.orderId = res.info.id
          localStorage.setItem('idOrder', res.info.id)
        })
      }
    },
    isAdd2: function () {
      this.show1 = false
      this.show4 = false
    },
    // 仅为支付方式选择，无支付功能
    payStyle: function () {
      this.show2 = !this.show2
    },
    paySure: function () {
      this.show3 = !this.show3
    },
    // 销售代用户注册
    registerAgents: function () {
      const data = {
        userName: this.userName
      }
      sellerAgents(data).then(res => {
        // 用户id + 销售serviceCode即为代下单
        this.userId = res.info.id
        $('.btn-phone').text('成功')
        $('.btn-phone').css({
          'background': '#87cc67'
        })
      })
    },
    toAddAddress: function () {
      this.$router.push({ path: '/userAddress' })
    },
    toOther: function () {
      this.$router.push({ path: '/otherAddress' })
    },
    // 支付宝支付
    payAli: function () {
      const that = this
      that.payText = '支付宝支付'
      that.show2 = false
      that.show3 = false
      let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
      if (ua.indexOf('micromessenger') >= 0) {
        that.show4 = true
      } else {
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
    },
    // 是否在微信浏览器判断方法
    isWeixin: function () {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') >= 0) {
        return true
      } else {
        return false
      }
    },
    // 微信支付
    payWechat (parmse) {
      const that = this
      that.payText = '微信支付'
      // payType为2时为微信支付
      let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
      if (ua.indexOf('micromessenger') >= 0) {
        const data = {
          // openId: that.$store.getters.openId,
          openId: localStorage.getItem('openId'),
          id: that.orderId,
          payType: 2,
          isWc: 2 // 2是微信公众号支付
        }
        payAlipay(data).then(res => {
          wx.chooseWXPay({
            'timestamp': res.info.timeStamp,  // 时间戳，自1970年以来的秒数
            'nonceStr': res.info.nonceStr,  // 随机串
            'package': res.info.package,
            'signType': 'MD5',  // 微信签名方式z
            'paySign': res.info.paySign, // 微信签名
            success: function (res) {
              // 支付成功后的回调函数
              that.$router.push({path: 'payBack'})
            }
          })
        })
      } else {
        const data = {
          id: that.orderId,
          payType: 2,
          isWc: 1 // 1是浏览器H5支付
        }
        payAlipay(data).then(res => {
          location.href = res.info.mweb_url
        })
      }
    }
  }
}
</script>

<style lang="scss">
  #addReceive {
    background: #f5f5f5;
    width: 100%;
    font-weight: 200;
    height: auto;
    .add-address {
      width: 100%;
      .add-div{
        width: 800px;
        color: #4c4c4c;
        display: table-row;
        .position-icon {
          width: 200px;
          height: 110px;
          margin-left: 100px;
          margin-right: 100px;
          display: table-cell;
          text-align: center;
          vertical-align: middle;
          img {
            width: 80px;
            height: 100px;
          }
        }
        .address-add {
          display: table-cell;
          color: #4c4c4c;
          letter-spacing: 2px;
          font-weight: bold;
          vertical-align: middle;
          font-size: 70px;
          padding-top: 10%;
          padding-bottom: 10%;
        }
        .address-content {
          display: table-cell;
          color: #4c4c4c;
          width: 80%;
          padding-top: 50px;
          padding-bottom: 50px;
          padding-right: 50px;
          .add-title {
            width: 100%;
            font-size: 70px;
            font-weight: bold;
            margin-bottom: 30px;
            letter-spacing: 5px;
          }
          .add-text {
            width: 100%;
            font-size: 50px;
            font-weight: 200;
            margin-bottom: 30px;
            background: #f5f5f5;
            padding: 0;
          }
          .add-bottom {
            display: -webkit-flex;
            display: flex;
            justify-content: space-between;
            width: calc(100% - 100px);
            .add-tel {
              font-size: 50px;
              font-weight: 200;
            }
            .add-other {
              color: #a1a1a1;
              font-size: 50px;
              letter-spacing: 2.5px;
              font-weight: 200;
              }
          }
        }
      }
    }
    .add-text {
      background: #fff;
      padding: 50px;
      .item-input {
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        height: 200px;
        line-height: 200px;
        font-size: 60px;
        .input-left {
          color: #999;
        }
        .input-right {
          color: #4c4c4c;
          .style-right {
            display: -webkit-flex;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .input-phone {
              height: 180px;
              outline: none;
              border: 0;
              font-size: 60px;
              color: #999;
              padding-left: 50px;
            }
            .btn-phone {
              font-size: 50px;
              font-weight: 100;
              border-radius: 10px;
              width: 160px;
              height: 80px;
              border: 1px solid #ff5555;
              color: #fff;
            }
          }
        }
      }
      .pay-style {
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        width: 80%;
        .style-left {
          width: 100%;
          height: 180px;
          border: 0;
          color: #4c4c4c;
        }
        .style-right {
          display: -webkit-flex;
          display: flex;
          width: 100%;
          height: 180px;
          justify-content: space-between;
          align-items: center;
          color: #999;
          .weui-cell {
            width: 100%;
            height: 100%;
            font-size: 60px;
            font-weight: 200;
            color: #999;
            .vux-cell-bd {
              height: 100%;
              width: 100%;
            }
            .weui-cell__ft {
              margin-top: 0;
            }
          }
        }
      }
    }
    .img-text {
      padding-top: 100px;
      display: -webkit-flex;
      display: flex;
      justify-content: flex-start;
      .img-left {
        width: 450px;
        height: 450px;
        img {
          border-radius: 50px;
          width: 100%;
          height: 100%;
        }
      }
      .img-right {
        margin-left: 50px;
        .img-name {
          color: #4c4c4c;
          font-size: 80px;
          margin-bottom: 50px;
          font-weight: bold;
        }
        .img-count {
          color: #ff5555;
          font-size: 70px;
          margin-bottom: 150px;
        }
        .img-score {
          color: #999;
          font-size: 60px;
        }
      }
    }
    .item-remark {
      margin-top: 50px;
      height: auto;
      background: #fff;
      width: 100%;
      border: 0;
      .text-remark {
        width: 90%;
        padding: 5%;
        height: 80px;
        outline: none;
        border: 0;
        font-size: 60px;
        font-weight: 200;
        resize: none;
      }
    }
    .pay-btn {
      height: 200px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      position: absolute;
      bottom: 0;
      div {
        color: #ff5555;
        font-size: 55px;
        margin-left: 50px;
        span {
          color: #a1a1a1;
          font-size: 40px;
        }
      }
      .mint-button {
        margin-right: 50px;
        font-size: 65px;
        width: 300px;
        height: 120px;
        border-radius: 25px;
      }
    }
    .clear {
      display: block;
      content: '';
      clear: both;
    }
    .tips, .tips-alipay{
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
    .pay-option {
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 168;
        background: rgba(0,0,0,0.7);
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        .group {
          width: 90%;
          height: auto;
          padding: 0;
          margin: 0;
          background: #fff;
          border-radius: 20px;
          .weui-cells {
            width: calc(100% - 100px);
            margin: 0;
            padding: 50px;
            border-radius: 30px;
            .weui-cell {
              font-size: 65px;
              color: #4c4c4c;
              text-align: left;
              .weui-cell__hd {
                width: 0;
              }
              .vux-cell-bd {
                width: 0;
              }
              .weui-cell__ft {
                width: 100%;
                text-align: left;
              }
            }
            .cell-item {
              .weui-cell__ft {
                display: -webkit-flex;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 150px;
                line-height: 150px;
                .div-cell {
                  width: 90%;
                  display: -webkit-flex;
                  display: flex;
                  align-items: center;
                  img {
                    margin-right: 50px;
                  }
                }
              }
            }
            .pay-show-title {
              font-size: 70px;
              height: 150px;
              line-height: 150px;
              font-weight: bold;
              text-align: center;
              .weui-cell__ft {
                display: flex;
                justify-content: flex-start;
                span.title-left {
                  width: 5%;
                  color: #000;
                }
                span.title-right {
                  width: 95%;
                  text-align: center;
                }
              }
            }
            .pay-show-money {
              height: 150px;
              line-height: 150px;
              color: #4c4c4c;
              font-size: 75px;
              font-weight: bold;
              .text-red {
                color: #ff5555;
              }
            }
          }
        }
      }
    }
    .pay-order {
      .mask1 {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 168;
        background: rgba(0,0,0,0.7);
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        .group1 {
          width: 90%;
          height: auto;
          padding: 0;
          margin: 0;
          background: #fff;
          border-radius: 20px;
          .weui-cells {
            width: calc(100% - 100px);
            margin: 0;
            padding: 50px;
            border-radius: 30px;
            .weui-cell {
              font-size: 65px;
              color: #4c4c4c;
              text-align: left;
              .weui-cell__hd {
                width: 0;
              }
              .vux-cell-bd {
                width: 0;
              }
              .weui-cell__ft {
                width: 100%;
                text-align: left;
              }
            }
            .cell-item1 {
              .weui-cell__ft {
                display: -webkit-flex;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 150px;
                line-height: 150px;
                .div-cell {
                  width: 90%;
                  display: -webkit-flex;
                  display: flex;
                  align-items: center;
                  img {
                    margin-right: 50px;
                  }
                }
              }
            }
            .pay-show-title {
              font-size: 70px;
              height: 150px;
              line-height: 150px;
              font-weight: bold;
              text-align: center;
              .weui-cell__ft {
                display: flex;
                justify-content: flex-start;
                span.title-left {
                  width: 5%;
                  color: #000;
                }
                span.title-right {
                  width: 95%;
                  text-align: center;
                }
              }
            }
            .pay-show-money {
              height: 150px;
              line-height: 150px;
              color: #4c4c4c;
              font-size: 75px;
              font-weight: bold;
              .text-red {
                color: #ff5555;
              }
            }
          }
        }
      }
    }
  }
  .mint-actionsheet {
    width: 100%;
    background: #fff;
    .mint-actionsheet-list {
      padding: 0 50px;
      margin-bottom: 0!important;
      .mint-actionsheet-listitem {
        height: 120px;
        line-height: 120px;
        font-size: 65px;
        text-align: left;
        &:first-child {
          font-weight: bold;
          text-align: center;
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
