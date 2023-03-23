
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
//倒入网络请求的包
import {$http} from '@escook/request-miniprogram'

uni.$http = $http

//请求的根路径
$http.baseUrl = "http://www.uinav.com"

//自定义提示方法
uni.$showMsg = function(msg="数据请求失败",duration = 1500) {
  uni.showToast({
    title:msg,
    duration:duration,
    icon:'none'
  })
}

//请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title:"数据加载中..."
  })
}

//响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif