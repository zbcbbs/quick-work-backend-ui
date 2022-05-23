import store from '@/store'

export default {
  // 定义权限指令内容
  inserted(el, binding) {
    const { value } = binding // 需要的权限码
    const roles = store.getters && store.getters.roles // 实际拥有的权限码
    if (value && value instanceof Array) {
      if (value.length > 0) {
        const permissionRoles = value // 需要的
        const hasPermission = roles.some(role => {
          return permissionRoles.includes(role)
        })
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el) // 若无权限，移除当前标签，不显示
        }
      }
    } else {
      throw new Error(`权限使用方式： v-permission="['admin','editor']"`)
    }
  }
}
