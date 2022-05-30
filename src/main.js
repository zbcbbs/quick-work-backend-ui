import Vue from 'vue' // vue

import Cookies from 'js-cookie' // cookie
import 'normalize.css/normalize.css' // 重置样式

import Element from 'element-ui' // element ui
import './assets/styles/element-variables.scss'

import './assets/styles/index.scss' // 全局样式

import mavonEditor from 'mavon-editor' // markdown 编辑器
import 'mavon-editor/dist/css/index.css'

import dict from './components/Dict' // 字典

import checkPer from '@/utils/permission' // 权限指令
import permission from './components/Permission'

import VueHighlightJS from 'vue-highlightjs' // 代码高亮
import 'highlight.js/styles/atom-one-dark.css'

import App from './App' // 核心组件
import store from './store' // 状态管理
import router from './router/routers' // 路由

import './assets/icons' // 图标
import './router/index' // 路由权限控制
import 'echarts-gl' // Echarts图表

// 注册插件
Vue.use(checkPer) // 权限验证 checkPer()
Vue.use(permission) // 权限指令 v-permission
Vue.use(dict)
Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // Element Ui 默认尺寸
})

// You are running Vue in development mode.
// Make sure to turn on production mode when deploying for production.
// 阻止控制台显示上述的生产模式提示信息
Vue.config.productionTip = false

// 实例化Vue
new Vue({
  el: '#app', // 元素挂载
  router,
  store,
  render: h => h(App)
})
