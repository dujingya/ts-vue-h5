<template>
<div class="error_page" v-bgcolor data-bgcolor="">
    <!-- <custom-header :headerData="this.headerData"></custom-header> -->
    <div class="error_main" style="text-align:center" v-if="!img">
        <!--<img src="../../assets/img/img_unwifi@2x.png">-->
        <div class="error_text">
            <p>网络不给力，请再试一次</p>
<!--            <p>真忧伤呢~</p>-->
        </div>
        <div class="error_btn" @click="getReload()">刷新页面</div>
    </div>
    <div v-else class="gifError">
        <div class="imgBox">
            <!--<img src="../../assets/img/wifi_img.gif" alt="" class="gif">-->
            <p>网络连接失败</p>
            <div class="error_btn" @click="getReload()">点击重试</div>
        </div>
    </div>
</div>
</template>
<script>
export default {
  props: {
        // 重新加载回调函数
    // reload: {
    //   type: Function,
    //   required: true
    // },
    img: {
      type: String,
      required: false
    }
  },
  methods: {
    getReload () {
      location.reload()
    }
  },
  components: {}
}
</script>

<style lang="scss">
// @import "../../style/vars.scss";
.error_page {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #fff;
  z-index: 1000000;
    .error_main {
        img {
            text-align: center;
            width: 342px;
            height: 159px;
            margin: 94px auto 0;
        }
        .error_text {
            font-size: 15px;
            margin: 0 0 30px;
            color: #464749;
        }
        .error_btn {
            width: 120px;
            height: 34px;
            border-radius: 17px;
            /*border: 1px solid #51B79C;*/
            font-size: 15px;
            color: #fff;
            /*color: #2ECD93;*/
            background: #51B79C;
            /*background-color: #eafaf4;*/
            line-height: 34px;
            position: relative;
            margin: 0 auto;

        }
    }
    .gifError{
        height: 100%;
        background-color: #ffffff;
        text-align: center;
        .imgBox{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: calc(50% - 90px);
            width: 180px;
        }
        .gif{
            width: 54px;
            height: 46px;
            margin-bottom: 5px;
        }
        p{
            font-size: 12px;
            color: #292929;
        }
        .error_btn {
            height: 35px;
            border-radius: 5px;
            font-size: 15px;
            color: #2ECD93;
            background-color: #eafaf4;
            line-height: 35px;
            position: relative;
            margin: 8px auto 0;
        }
    }
}
</style>
