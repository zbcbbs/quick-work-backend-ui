<template>
  <div v-if="!item.hidden && item.path != '/'" class="nav-menu-div">

    <!-- 顶部 路由菜单 -->
    <!-- <app-link :to="resolvePath(item.path)"> -->
      <el-menu-item :index="resolvePath(item.path)" popper-append-to-body>
        <template slot="title">
          <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
        </template>
      </el-menu-item>
    <!-- </app-link> -->

  </div>

</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import AppLink from './Link'
import Item from './Item'

export default{
  name: 'NavbarItem',
  components: { AppLink, Item },
  props: {
    // 父组件传递的值
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data(){

    return {

    }
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>

  /* 顶部 导航菜单样式*/
  .nav-menu-div {
    height: 50px;
    float: left;

    .el-menu-item{
      height: 50px;
      line-height: 50px;
      padding: 0 15px;

      span{
        margin-left: 5px;
      }

    }
  }

</style>
