import Vue from 'vue'
import App from './App.vue'
import VueCookie from 'vue-cookie'
import router from './router'
import store from './store'
import vueBus from './plugins/vue-bus';
import '@/filters';
import vuescroll from 'vuescroll/dist/vuescroll-native';
import ossUpload from "@glo/kmf-oss-upload";
import VueClipboard from 'vue-clipboard2'

import Vconsole from 'vconsole';
// if (process.env.NODE_ENV != "production") {
//     new Vconsole();
// }

import './plugins/vue-plyr';
import './plugins/element.js'
import './plugins/kmf-axios.js'
import './plugins/kmfSensors'; //引入神策
// 导航守卫
import guard from '@/utils/guard';
// import infiniteScroll from 'vue-infinite-scroll';
import '@/components' // 引入全局注册的组件
Vue.use(vueBus)
Vue.use(ossUpload)
Vue.use(VueClipboard)
// Vue.use(infiniteScroll)

Vue.use(vuescroll,{
  ops:{
    bar: {
      background: '#ededed',
      size:'5px'
    }
  }
});
// 进入路由前校验
router.beforeEach((to, from, next) => {
  guard(to, from, next);
})

Vue.config.productionTip = false;

Vue.prototype.$cookie = VueCookie;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
