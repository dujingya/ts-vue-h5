import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'lib-flexible'
import 'babel-polyfill'
import vueMoment from 'vue-moment'
import { Loading, Button, Dialog } from 'vant'
import 'vant/lib/index.css'
import ReloadPage from './components/ReloadPage.vue'
import Support from './components/support.vue'

import share from './utils/share' // 封装的分享组件
Vue.component('Support', Support)

Vue.use(vueMoment)
Vue.use(share)
Vue.component('reload-page', ReloadPage)
Vue.directive('bgcolor', {
    inserted: (el, binding) => {
        document.body.className = el.dataset.bgcolor
    },
    update: (el, binding) => {
        document.body.className = el.dataset.bgcolor
    }
})
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
