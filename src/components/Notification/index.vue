<template>
  <!-- 未读通知 -->
  <el-dropdown>
    <el-badge :value="3" class="el-dropdown-link" type="warning">
      <i class="el-icon-bell" />
    </el-badge>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item divided>
        <div class="message-item">
          <span class="m-icon"><i class="el-icon-message" /></span>
          <span class="m-title">会员注册成功通知</span>
          <span class="m-time"><i class="el-icon-time" />3小时前</span>
        </div>
      </el-dropdown-item>
      <el-dropdown-item divided>
        <div class="message-item">
          <span class="m-icon"><i class="el-icon-message-solid" /></span>
          <span class="m-title">实名认证已通过</span>
          <span class="m-time"><i class="el-icon-time" />1小时前</span>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
  }

  ::v-deep .el-icon-bell {
    font-size: 20px;
  }

  ::v-deep .el-badge__content {
    font-size: 3px;
    height: 15px;
    line-height: 15px;
    margin-top: 18px !important;
    padding: 0 2px;
    border-radius: 10px;
  }

  .el-dropdown-menu__item {
    line-height: 8px;
    padding: 0 20px;
  }

  .message-item {
    height: 30px;
    line-height: 30px;
    font-size: 13px;

    .m-icon {
      i {
        font-size: 14px;
      }
    }

    .m-title {
      font-size: 10px;
      margin-left: 10px;
    }

    .m-time {
      float: right;
      margin-left: 50px;
      font-size: 10px;
      color: gray;
    }
  }
</style>
