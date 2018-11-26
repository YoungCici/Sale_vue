<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    this.init()
  },
  methods: {
    init: function () {
      $('#app').css({
        'fontSize': $(window).width() / 37.5,
        'height': $(window).height()
      })
      $(window).on('resize', function () {
        $('#app').css({
          'fontSize': $(window).width() / 37.5,
          'height': $(window).height()
        })
      }).resize()
      // 在页面加载时读取localStorage里的状态信息
      localStorage.getItem('userMsg') && this.$store.replaceState(JSON.parse(localStorage.getItem('userMsg')))
      // 在页面刷新时将vuex里的信息保存到localStorage里
      window.addEventListener('beforeunload', () => {
        localStorage.setItem('userMsg', JSON.stringify(this.$store.state))
      })
    }
  }
}
</script>

<style lang="scss">
  @import "./assets/scss/font.css";
  * {
    margin: 0;
    padding: 0;
  }
  html {
    height: 100%;
    font-size: calc(100vw / 37.5)!important;
    font-weight: 400;
    body, #app {
      min-height: 100%;
    }
  }
</style>
