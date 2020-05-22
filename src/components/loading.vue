<!-- 中医问卷题目 reportlist 备份-->
<template>
  <div class="load-model">
    <div class="load-width">
      <Loading color="#fff" size="30px" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Loading } from 'vant'
  @Component({
      components: {
          Loading
      }
  })
  export default class Load extends Vue {
  }
</script>

<style lang=scss>
  .load-model{
    display: flex;
    position: fixed;
    width: 375px;
    top: 0;
    height: 100%;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .load-width{
      /*width: 120px;*/
      /*height: 120px;*/
      border-radius: 10px;
      -webkit-border-radius: 10px;
      padding: 30px;
      background: rgba(0,0,0,.5);
    }
  }
</style>

