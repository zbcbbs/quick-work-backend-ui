import router from './routers' // 路由
import store from '@/store' // 状态管理
import Config from '@/settings' // 全局配置
import NProgress from 'nprogress' // 顶部进度条
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth' // 令牌缓存
import { buildMenus } from '@/api/system/menu' // 菜单渲染
import {
  filterAsyncRouter,
  filterSideChildRouter
} from '@/store/modules/permission' // 处理服务端路由数据 转化为 前端组件

// 进度条配置
NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login'] // 白名单路径

/**
 * 路由 导航守卫 访问权限控制
 * to: 目标路由
 * from: 源路由
 * next: 一个函数 表示放行
 * next() 放行 next('/login') 强制跳转
 */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title // 网页标题
  }
  NProgress.start()
  if (getToken()) { // 登录状态
    if (to.path === '/login') { // 登录页直接放行，跳转到首页
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) { // 判断是否拉取了用户信息
        store.dispatch('GetInfo').then(() => {
          loadMenus(next, to) // 渲染路由
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 重新实例化 vue-router 避免 BUG
          })
        })
      } else if (store.getters.loadMenus) { // 第一次登录时需要渲染路由
        store.dispatch('updateLoadMenus') // 设置为 false 避免死循环
        loadMenus(next, to) // 渲染路由
      } else {
        next()
      }
    }
  } else { // 未登录状态
    if (whiteList.indexOf(to.path) !== -1) { // 白名单路径，直接放行
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 跳转到登录页面，并携带要请求的路径
      NProgress.done()
    }
  }
})

// 渲染侧栏路由
export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    console.info('路由集合：')
    console.info(res)
    const sdata = JSON.parse(JSON.stringify(res.data))
    const rdata = JSON.parse(JSON.stringify(res.data))
    const navbarRoutes = filterAsyncRouter(sdata) // 顶部路由

    // 判断是否 渲染顶部路由导航
    var sidebarRoutes
    if (store.getters.showTopNavbar) {
      // 顶部显示一级路由
      sidebarRoutes = filterSideChildRouter(navbarRoutes, navbarRoutes[0].path) // 默认 第一个顶部路由 对应的 侧栏路由
    } else {
      // 全部显示在侧栏
      sidebarRoutes = filterAsyncRouter(sdata) // 侧栏路由
    }

    const rewriteRoutes = filterAsyncRouter(rdata, true) // 动态路由
    // console.info("==侧栏==")
    // console.info(sidebarRoutes);
    // console.info("==顶部==")
    // console.info(navbarRoutes);
    console.info('==动态路由==')
    console.info(rewriteRoutes)
    rewriteRoutes.push({
      path: '*',
      redirect: '/404',
      hidden: true
    }) // URL不存在 自动定向到 404页面

    store.dispatch('GenerateRoutes', rewriteRoutes).then(() => { // 缓存路由
      router.addRoutes(rewriteRoutes) // 动态路由添加
      next({
        ...to,
        replace: true
      })
    })
    store.dispatch('SetSidebarRouters', sidebarRoutes)
    store.dispatch('SetNavbarRouters', navbarRoutes)
  })
}

router.afterEach(() => {
  NProgress.done() // 停止进度条
})
