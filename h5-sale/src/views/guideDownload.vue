<template>
  <div id="guideDownload">
    <div class="img-header"></div>
    <div class="text-content">
      <div class="text-01">
        <span>随时随地</span>
        <span>快乐实习</span>
        <span>轻松护考</span>
      </div>
      <div class="text-02">
        快速解决临床护理实习和护考痛点
      </div>
    </div>
    <div class="btn-div">
      <input type="button" @click="toDownApp" value="点击下载" class="btn-down">
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toDownApp () {
      location.href = 'http://www.yihuzhijia.cn/download.html'
    }
  }
}
</script>

<style lang="scss">
  #guideDownload {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('../assets/img/tuceng0.png') no-repeat center;
    background-size: 100% 100%;
    .img-header {
      position: absolute;
      top: 10%;
      left: 0;
      width: 90%;
      margin-left: 5%;
      height: 55%;
      background: url('../assets/img/zu2.png') no-repeat center;
      background-size: 100% 100%;
    }
    .text-content {
      width: 100%;
      height: 20%;
      position: absolute;
      top: 65%;
      left: 0;
      .text-01 {
        width: 100%;
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        font-size: 90px;
        color: #fff;
        span {
          display: -webkit-flex;
          display: flex;
          &:nth-child(2) {
            margin-left: 3%;
            margin-right: 3%;
          }
        }
      }
      .text-02 {
        width: 100%;
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        font-size: 70px;
        color: #fff;
        font-weight: 100;
        margin-top: 50px;
        
      }
    }
    .btn-div {
      position: absolute;
      width: 100%;
      height: 10%;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 83%;
      left: 0;
      .btn-down {
        width: 50%;
        height: 150px;
        line-height: 80px;
        background: #fff;
        border-radius: 105px;
        box-shadow: 0 0 75px 0 rgba(255,52,57,0.2);
        color: #fe5b5c;
        letter-spacing: 3px;
        font-size: 65px;
        text-align: center;
        border: 0;
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
