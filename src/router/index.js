import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

// 路由操作 no-referrer 解决跨域问题
const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home', component: Home, meta: {
      title: "vue-bilibili",
      name: "referrer",
      content: "no-referrer"
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
