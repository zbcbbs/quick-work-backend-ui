import { constantRouterMap } from '@/router/routers'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'

const permission = {
  state: {
    routers: constantRouterMap, // 路由集合
    addRouters: [], // 动态路由
    sidebarRouters: [], // 侧边栏路由
    navbarRouters: [] // 顶部路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_SIDEBAR_ROUTERS: (state, routers) => {
      state.sidebarRouters = constantRouterMap.concat(routers)
    },
    SET_NAVBAR_ROUTES: (state, routers) => {
      state.navbarRouters = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    },
    SetSidebarRouters({ commit }, sidebarRouter) {
      commit('SET_SIDEBAR_ROUTERS', sidebarRouter)
    },
    SetNavbarRouters({ commit }, navbarRouters) {
      commit('SET_NAVBAR_ROUTES', navbarRouters)
    }
  }
}

// 筛选 顶部一级路由对应的 侧栏路由
// routers：一级路由集合
// rootPath: 要筛选的路由 path
export const filterSideChildRouter = (routers, rootPath) => {
  // 筛选 rootPath 对应的路由
  const a = routers.filter(item => {
    return item.path == rootPath
  }).map(item => {
    return item
  })
  var route = a[0] // 当前一级路由
  // console.info(route);

  // 预处理侧栏路由
  // 一级路由 path 追加到 二级路由
  // 侧栏渲染时 需要追加 上级路径
  var c = route.children.filter(item => {
    // 会多次调用 已经追加过 不再操作
    if (!(item.path.indexOf(route.path) != -1)) {
      item.path = route.path + '/' + item.path
    }
    return item
  }).map(item => {
    return item
  })
  // console.info(c);
  return c
}

// 遍历后台传来的路由字符串，转换为前端组件
export const filterAsyncRouter = (routers, isRewrite = false) => {
  return routers.filter(router => {
    if (isRewrite && router.children) {
      router.children = filterChildren(router.children)
    }
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else if (router.component === 'ParentView') {
        router.component = ParentView
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    // 递归
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children, router, isRewrite)
    }
    return true
  })
}

// 构建树形路由结构
function filterChildren(childrenMap) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            // 递归
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
