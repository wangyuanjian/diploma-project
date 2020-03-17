import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/authority/Roles.vue'
import Authorities from '../components/authority/Authorities.vue'
import Categories from '../components/finance/Categories.vue'
import Goods from '../components/finance/Goods.vue'
import AddGoods from '../components/finance/AddGoods.vue'
import Order from '../components/finance/Order.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/authorities', component: Authorities },
      { path: '/categories', component: Categories },
      { path: '/goods', component: Goods },
      { path: '/orders', component: Order },
      { path: '/goods/add', component: AddGoods }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// to：将要访问的路径，from：从哪个路径跳转而来
// next():放行，next('/login')强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/index') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})
export default router
