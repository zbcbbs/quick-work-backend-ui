<template>
  <!-- 未读消息 -->
  <el-dropdown>
    <el-badge :value="2" class="el-dropdown-link">
      <i class="el-icon-message"></i>
    </el-badge>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>
        <div class="message-item">
          <div class="m-avatar">
            <img src="@/assets/images/user1-128x128.jpg" width="50" height="50" />
          </div>
          <div class="m-content">
            <h3 class="m-user">北辰</h3>
            <p class="m-msg">抓紧时间提交代码，客户已经催了...</p>
            <p class="m-time"><i class="el-icon-time"></i>3小时前</p>
            <i class="el-icon-star-off m-star"></i>
          </div>
        </div>
      </el-dropdown-item>
      <el-dropdown-item divided>
        <div class="message-item">
          <div class="m-avatar">
            <img src="@/assets/images/user2-128x128.jpg" width="50" height="50" />
          </div>
          <div class="m-content">
            <h3 class="m-user">北辰</h3>
            <p class="m-msg">看到消息，给我打个电话...</p>
            <p class="m-time"><i class="el-icon-time"></i>4小时前</p>
            <i class="el-icon-star-off m-star"></i>
          </div>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</template>

<script>
  export default {
    name: 'Message',
    data() {
      return {

      }
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

  .el-dropdown-link {
    cursor: pointer;
  }

  /* ::v-deep：覆盖 element 默认样式 */
  ::v-deep .el-icon-message {
    font-size: 20px;
  }

  /* 小徽章图标*/
  ::v-deep .el-badge__content {
    font-size: 3px;
    height: 15px;
    line-height: 14px;
    margin-top: 17px !important;
    padding: 0 2px;
    border-radius: 50px;
  }

  /* 下拉菜单 li */
  .el-dropdown-menu .el-dropdown-menu__item {
    line-height: 8px;
    padding: 0 15px;
    font-size: 12px;
    position: relative;
  }

  /* 下拉菜单 li / div */
  .message-item {
    height: 85px;

    .m-avatar {
      float: left;
      margin-top: 5px;

      img {
        border-radius: 50px;
      }
    }

    .m-content {
      float: left;
      margin-left: 10px;
      line-height: 12px;

      .m-user {
        font-size: 14px;
        padding: 0 0;
      }

      .m-msg {
        font-size: 10px;
      }

      .m-time {
        font-size: 10px;
        color: gray;
      }

      .m-star {
        color: #DC3545;
        font-size: 18px;
        position: absolute;
        top: 5px;
        right: 5px;
      }
    }
  }
</style>
