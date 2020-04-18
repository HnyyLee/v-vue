import 'babel-polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import StrikeUI from 'strike-ui-vue'
import '../node_modules/strike-ui-vue/packages/theme-set/index.css' // 导入UI样式

import { Scrollbar } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/router/permission'

import VueCookies from 'vue-cookies'

import request from '@/common/utils/request'

import Cookies from 'js-cookie'
Vue.prototype.$request = request

export var bus = new Vue()
Vue.prototype.$Cookies = Cookies
Vue.prototype.$mycookies = VueCookies

Vue.use(StrikeUI)
Vue.use(VueCookies)
Vue.use(Scrollbar)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
