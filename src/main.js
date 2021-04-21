import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 解决跨域问题
// import '../vue.config.js'

// 导入全局样式表
import './assets/css/global.css'

import NavBar from "./components/common/NavBar";

// axios请求数据
import axios from "axios"
Vue.prototype.$axiosbili = axios
axios.defaults.baseURL = '/api'

Vue.config.productionTip = false

// 注册为全局组件
Vue.component('nav-bar', NavBar)

// 路由操作 解决跨域问题
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面meta */
  if (to.meta.content) {
    let head = document.getElementsByTagName('head');
    let meta = document.createElement('meta');
    meta.name = to.meta.name;
    meta.content = to.meta.content;
    head[0].appendChild(meta)
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
