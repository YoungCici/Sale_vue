<template>
  <div id="msgShow" v-show="panelShow">
    <div class="tips-title">提示</div>
    <div class="tips-content">{{ tips }}</div>
    <div class='tips-btn' @click="hidePanel">确定</div>
  </div>
</template>

<script>
export default {
  name: 'msgShow',
  props: {
    tips: {
      type: String,
      required: true
    },
    panelShow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    hidePanel () {
      this.panelShow = false
      this.$emit('logined')
    }
  }
}
</script>

<style lang="scss">
#msgShow {
    width: 70%;
    left: calc((30% - 40px) / 2);
    top: 350px;
    height: auto;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 5px 30px 0 rgba(208,208,208,0.2);
    position: fixed;
    z-index: 999;
    padding: 20px;
    .tips-title {
        height: 100px;
        line-height: 100px;
        margin-bottom: 20px;
        font-size: 65px;
        color: #333;
        font-weight: bolder;
        text-align: center;
        width: 100%;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
    }
    .tips-content {
        width: 100%;
        min-height: 250px;
        line-height: 50px;
        padding-top: 50px;
        font-size: 50px;
        color: #333;
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 30px;
    }
    .tips-btn {
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

