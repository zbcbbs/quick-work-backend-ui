import permission from './permission'

// 声明插件
const install = function(Vue) {
  // 全局权限指令
  Vue.directive('permission', permission)
}

if (window.Vue) {
  window['permission'] = permission
  Vue.use(install) // 插件注册
}

permission.install = install
export default permission
