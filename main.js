import Vue from 'vue'
import App from './App'
import store from './store'

// 引入uview-ui组件库
import uView from "uview-ui"
Vue.use(uView)

import zhouWeiNavBar from "@/components/zhouWei-navBar";
Vue.component("nav-bar", zhouWeiNavBar);

import { throttle, msg } from '@/common/js/function.js'

Vue.prototype.$store = store
Vue.prototype.$util = { msg, throttle }

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
