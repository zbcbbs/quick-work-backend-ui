<template>
  <div class="navbar">

    <!-- 侧边栏 切换按钮 -->
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- 面包屑 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <!-- 左侧导航 -->
    <!-- 根据全局配置 判断是否渲染顶部路由导航 -->
    <template v-if="device !== 'mobile' && showTopNavbar">
      <div class="left-menu">
        <el-menu
          :default-active="activeMenu"
          class="el-menu"
          mode="horizontal"
          active-text-color="#409EFF"
          @select="handleSelect"
        >

          <!-- 遍历 一级导航 -->
          <navbar-item v-for="route in navbarRouters" :key="route.path" :item="route" :base-path="route.path" />

        </el-menu>
      </div>
    </template>

    <!-- 右侧导航 -->
    <div class="right-menu">

      <!-- 下拉菜单-->
      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
          <img :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar" class="user-avatar">
          <span class="avatar-user-name" v-text="user.nickName" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <i class="el-icon-s-home" />控制台

            </el-dropdown-item>
          </router-link>
          <router-link to="/user/center">
            <el-dropdown-item>
              <i class="el-icon-user" />个人信息
            </el-dropdown-item>
          </router-link>
          <span style="display:block;" @click="show = true">
            <el-dropdown-item>
              <i class="el-icon-lock" />布局设置
            </el-dropdown-item>
          </span>
          <el-dropdown-item divided @click.native="open">
            <span style="display:block;">
              <i class="el-icon-switch-button" />退出
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <template v-if="device !== 'mobile'">
        <!-- 消息 -->
        <message id="message" class="right-menu-item hover-effect" />
        <!-- 通知 -->
        <notification id="notication" class="right-menu-item hover-effect" />
        <!-- 全屏 -->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <!-- 尺寸设置 -->
        <el-tooltip content="尺寸设置" effect="dark" placement="bottom-end">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <!-- 项目文档 -->
        <el-tooltip content="项目文档" effect="dark" placement="bottom-end">
          <Doc class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { filterSideChildRouter } from '@/store/modules/permission' // 筛选顶部一级路由下的二级路由
import NavbarItem from '@/layout/components/Navbar/NavbarItem' // 顶部导航
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Doc from '@/components/Doc'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Message from '@/components/Message'
import Notification from '@/components/Notification'
import Search from '@/components/HeaderSearch'
import Avatar from '@/assets/images/user1-128x128.jpg'

export default {
  components: {
    NavbarItem,
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Message,
    Notification,
    Search,
    Doc
  },
  data() {
    return {
      Avatar: Avatar,
      dialogVisible: false
    }
  },
  computed: { // 计算属性 组件初始化时同步初始化
    ...mapGetters([
      'sidebar',
      'device',
      'user',
      'baseApi',
      'navbarRouters' // 顶部路由
    ]),
    show: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    activeMenu: {
      set(val) {
        // 缓存选中的 nav
        console.info(val[0])
        this.$store.dispatch('app/setActiveTopMenu', val[0])
      },
      get() {
        var active = this.$store.state.app.activeTopMenu
        console.info('顶部激活：' + active)
        if (active == null || active == undefined) {
          var routes = this.$store.state.permission.navbarRouters
          var t = routes.filter(item => {
            return !item.hidden && item.path != '/'
          }).map(item => {
            return item
          })
          active = t[0].path
        }

        // 筛选 获取当前点击的路由 对应的侧栏路由
        const c = filterSideChildRouter(this.navRoutes, active)

        // 刷新 侧栏路由
        this.$store.dispatch('SetSidebarRouters', c)
        return active
      }
    },
    navRoutes() { // 顶部路由导航
      return this.$store.state.permission.navbarRouters
    },
    showTopNavbar() { // 是否渲染顶部路由导航
      return this.$store.state.settings.showTopNavbar
    }
  },
  watch: { // 属性监控
    $route: { // 路由监控
      handler: function(route) {
        // console.info(route);
      },
      immediate: true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleSelect(index, indexPath) {
      console.info('一级导航：' + index + '==' + indexPath)

      this.activeMenu = indexPath // 缓存选中的顶部导航

      // 筛选 获取当前点击的路由 对应的侧栏路由
      const c = filterSideChildRouter(this.navRoutes, indexPath)

      // 刷新 侧栏路由
      this.$store.dispatch('SetSidebarRouters', c)

      // 刷新页面
      // this.$router.push({ path: '/' })
    },
    open() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 刷新页面
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    /* 左侧导航 */
    .left-menu {
      float: left;
      height: 100%;
      margin-left: 10px;

      .el-menu {
        height: 51px;

        .el-menu-item {
          height: 50px;
          line-height: 50px;
          padding: 0 12px;

          i {
            vertical-align: text-bottom;
          }
        }
      }
    }

    /* 右侧导航*/
    .right-menu {
      float: right;
      height: 100%;
      line-height: 55px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 10px;
        height: 100%;
        font-size: 16px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 15px;

        .avatar-wrapper {
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 38px;
            height: 38px;
            border-radius: 50px;
            margin-right: 40px;
            margin-top: 5px;
          }

          .avatar-user-name {
            // font-size: 14px;
            // margin-left: 10px;
            cursor: pointer;
            position: absolute;
            right: -5px;
            top: 0px;
            font-size: 12px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 20px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
