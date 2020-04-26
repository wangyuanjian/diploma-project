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
// import './element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 导入组件相关样式
// import 'element-ui/lib/theme-chalk/index.css'
// 配置 Vue 插件
// Vue.use(ElementUI)
// 使用树形组件
import axios from 'axios'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 导入加载进度条
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://your-ip:8080'
// 在 request 拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
// 定义过滤器
Vue.filter('sub-goods-name', function (value, size) {
  if (value.length >= size) {
    return value.substr(0, size) + '...'
  } else {
    return value
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
