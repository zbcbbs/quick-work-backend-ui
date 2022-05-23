<script>
export default {
  created() { // 当前组件创建时，直接路由到重定向的目标地址
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
