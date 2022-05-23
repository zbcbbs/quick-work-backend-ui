<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.name" clearable size="small" placeholder="请输入表名" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation>
        <el-tooltip slot="right" v-permission="['tool:code:sync']" class="item" effect="dark" content="库中表字段发生变动时使用该功能" placement="top-start">
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-refresh"
            :loading="syncLoading"
            :disabled="crud.selections.length === 0"
            @click="sync"
          >同步</el-button>
        </el-tooltip>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="tableName" label="表名" />
      <el-table-column :show-overflow-tooltip="true" prop="engine" label="数据库引擎" />
      <el-table-column :show-overflow-tooltip="true" prop="coding" label="字符编码集" />
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" />
      <el-table-column prop="createTime" label="创建日期" />
      <el-table-column label="操作" width="160px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['tool:code:preview']" size="mini" style="margin-right: 2px" type="text">
            <router-link :to="'/platform/sys-tools/generator/preview/' + scope.row.tableName">
              预览
            </router-link>
          </el-button>
          <el-button v-permission="['tool:code:download']" size="mini" style="margin-left: -1px;margin-right: 2px" type="text" @click="toDownload(scope.row.tableName)">下载</el-button>
          <el-button v-permission="['tool:code:config']" size="mini" style="margin-left: -1px;margin-right: 2px" type="text">
            <router-link :to="'/platform/sys-tools/generator/config/' + scope.row.tableName">
              配置
            </router-link>
          </el-button>
          <el-button v-permission="['tool:code:generator']" type="text" style="margin-left: -1px" size="mini" @click="toGen(scope.row.tableName)">生成</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>

import { generator, sync, download } from '@/api/generator/generator'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'GeneratorIndex',
  components: { pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ url: 'api/generator/tables', sort: ['create_time,desc'] })
  },
  mixins: [presenter(), header()],
  data() {
    return {
      syncLoading: false
    }
  },
  created() {
    this.crud.optShow = { add: false, edit: false, del: false, download: false, reset: true }
  },
  methods: {
    toGen(tableName) {
      // 生成代码
      generator(tableName, 0).then(data => {
        this.$notify({
          title: '生成成功',
          type: 'success',
          duration: 2500
        })
      })
    },
    toDownload(tableName) {
      // 打包下载
      download(tableName).then(data => {
        downloadFile(data, tableName, 'zip')
      })
    },
    sync() {
      const tables = []
      this.crud.selections.forEach(val => {
        tables.push(val.tableName)
      })
      this.syncLoading = true
      sync(tables).then(() => {
        this.crud.refresh()
        this.crud.notify('同步成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.syncLoading = false
      }).then(() => {
        this.syncLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
