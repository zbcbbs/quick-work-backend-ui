import Dict from './Dict'

// 插件声明
const install = function(Vue) {
  // 全局 Mixin 针对所有组件起作用
  Vue.mixin({
    data() {
      // this.$options：当前组件的选项，可以调用自定义的属性
      if (this.$options.dicts instanceof Array) {
        const dict = {
          dict: {},
          label: {}
        }
        return {
          dict
        }
      }
      return {}
    },
    created() {
      if (this.$options.dicts instanceof Array) {
        new Dict(this.dict).init(this.$options.dicts, () => {
          // DOM刷新后 触发 dictReady 事件执行
          this.$nextTick(() => {
            this.$emit('dictReady')
          })
        })
      }
    }
  })
}

export default { install }
