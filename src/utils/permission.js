import store from '@/store'

/**
 * 权限验证
 */
export default {
  install(Vue) {
    Vue.prototype.checkPer = (value) => {
      if (value && value instanceof Array && value.length > 0) {
        const roles = store.getters && store.getters.roles
        const permissionRoles = value
        return roles.some(role => {
          return permissionRoles.includes(role)
        })
      } else {
        console.error(`need roles! Like v-permission="['admin','sys:user:edit']"`)
        return false
      }
    }
  }
}
