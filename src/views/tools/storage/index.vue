<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane label="本地存储" name="first">
      <Local ref="local" />
    </el-tab-pane>
    <el-tab-pane label="腾讯云存储" name="second">
      <Cos ref="cos" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Cos from './cos/index'
import Local from './local/index'
export default {
  name: 'Storage',
  components: { Cos, Local },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    tabClick(name) {
      if (this.activeName === 'first') {
        this.$refs.local.crud.toQuery()
      } else {
        this.$refs.cos.crud.toQuery()
      }
    }
  }
}
</script>

<style scoped>
</style>
