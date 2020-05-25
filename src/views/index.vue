<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script lang="ts">
    // @ is an alias to /src
    import HelloWorld from '../components/HelloWorld.vue'
    import { Component, Vue, Model } from 'vue-property-decorator';
    @Component({
        components: {
            HelloWorld
        }
    })
    export default class Home extends Vue {
       private arr: any[] = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
       private newArray: any[] = []
       private created() {
          this.unique(this.arr)
           console.log(this.newArray)
           let newArr = new Set(this.newArray)
           for (let i = 0; i < newArr.leng;)
           console.log(newArr)
       }
       unique(arr) {
           arr.forEach((item) => {
               if (Object.prototype.toString.call(item) === '[object Array]') {
                   this.unique(item)
               } else {
                   this.newArray.push(item)
               }
           })
       }
    }
</script>
