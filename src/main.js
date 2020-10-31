import Vue from 'vue'
import App from '@/App'

// 引入piui
import piui from '@/piui'
Vue.use(piui)

// 引入核心业务
import sadaisCore from '@/sadais-core'
Vue.use(sadaisCore)

// vuex
import store from '@/store'
Vue.prototype.$store = store

// 安装utils快捷调用方式
import utils from '@/utils'
Vue.prototype.$utils = utils
console.log('已安装$utils，使用方式：this.$utils', utils)

// 下拉刷新组件
import MescrollBody from 'mescroll-uni/mescroll-body.vue'
import MescrollUni from 'mescroll-uni/mescroll-uni.vue'
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

import WxAuth from '@/components/wx-auth'
Vue.component('wx-auth', WxAuth)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
