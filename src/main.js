import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式
import '../src/assets/css/global.css'
// 导入第三方图标库,就是阿里的图标库
import './assets/fonts/iconfont.css'

// 导入组件库
// import ElementUI from 'element-ui'
// 采用按需导入的形式
import './element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 导入组件相关样式
import 'element-ui/lib/theme-chalk/index.css'
// 配置 Vue 插件
// Vue.use(ElementUI)
// 使用树形组件
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8080'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
