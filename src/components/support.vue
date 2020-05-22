<!-- 中医问卷题目 reportlist 备份-->
<template>
  <div class="surpport">
    <div class="transprant" @click="getErrorUrl"></div>
    <div class="jishuzhichi" >来康提供技术支持</div>
    <div class="errorURL" v-if="doubleClick">{{URL}}</div>
  </div>
</template>

<script>
  // import { Loading } from 'vant'
  export default {
    data () {
      return {
        URL: '',
        doubleClick: false
      }
    },
    components: {
      // Loading
    },
    mounted () {
    },
    methods: {
      getErrorUrl () {
        let nowTime = new Date().getTime()
        if (nowTime - this.lastClickTime < 400) {
          this.lastClickTime = 0
          let url = sessionStorage.getItem('errUrl')
          if (url && url !== null && url !== 'null' && url !== 'undefind') {
            this.doubleClick = true
            this.URL = url
            setTimeout(() => {
              this.doubleClick = false
            }, 3000)
          }
        } else {
          this.lastClickTime = nowTime
        }
      }
    }
  }
</script>

<style lang=scss>
  .surpport{
    /*position: relative;*/
    /*height: 40px;*/
  }
  .transprant{
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 40px;
    height: 24px;
  }
  .jishuzhichi{
    font-size: 12px;
    line-height: 24px;
    color: #525252;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    &:before{
      content: '';
      width: 24px;
      position: absolute;
      height: 1px;
      background: #525252;
      top:50%;
      left: -30px;
      opacity: 0.4;
    }
    &:after{
      content: '';
      width: 24px;
      position: absolute;
      height: 1px;
      background: #525252;
      top:50%;
      right: -30px;
      opacity: 0.4;
    }
  }
  .errorURL{
    position: fixed;
    display: flex;
    justify-content: center;
    color: #fff;
    bottom: 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizeing: border-box;
    background: rgba(0,0,0, .2);
  }
</style>

