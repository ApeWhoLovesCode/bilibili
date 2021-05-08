import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../components/Home.vue'
// import Search from '../components/Search.vue'

// 懒加载 动态加载
const Home = () => import('../components/Home.vue')
const Search = () => import('../components/Search.vue')

Vue.use(VueRouter)

// 路由操作 no-referrer 解决跨域问题
const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home', component: Home, meta: {
      title: "ViliVili",
      name: "referrer",
      content: "no-referrer"
    }
  },
  {
    path: '/search', component: Search, meta: {
      title: "ViliVili",
      name: "referrer",
      content: "no-referrer"
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
