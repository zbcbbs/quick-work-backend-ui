<template>
  <div class="app-container" style="padding: 8px;">
    <!--表单组件-->
    <eForm ref="form" />
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable size="small" placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <date-range-picker v-model="query.time" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission">
        <template slot="left">
          <!-- 上传 -->
          <el-button v-permission="['tool:file:cos:upload']" class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="dialog = true">上传</el-button>
          <!-- 配置 -->
          <el-button
            v-permission="['tool:file:cos:config']"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-s-tools"
            @click="doConfig"
          >配置</el-button>
        </template>
      </crudOperation>
      <!-- 文件上传 -->
      <el-dialog :visible.sync="dialog" title="上传" :close-on-click-modal="false" append-to-body width="500px" @close="doSubmit">
        <el-upload
          :before-remove="handleBeforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :headers="headers"
          :action="cosUploadApi"
          class="upload-demo"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过15M</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" :show-overflow-tooltip="true" label="文件名">
          <template slot-scope="scope">
            <a href="JavaScript:" class="el-link el-link--primary" type="primary" @click="download(scope.row.id, scope.row.cacheName)">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="预览">
          <template slot-scope="{row}">
            <el-image :src="row.url" fit="contain" :preview-src-list="[row.url]" class="el-avatar">
              <!-- 加载失败显示-->
              <div slot="error">
                <i class="el-icon-document" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="contentType" label="内容类型" @selection-change="crud.selectionChangeHandler" />
        <el-table-column prop="type" label="类别" />
        <el-table-column prop="cacheName" label="存储名称" />
        <el-table-column prop="cachePath" label="存储路径" />
        <el-table-column prop="path" label="相对路径" />
        <el-table-column prop="bucket" label="存储桶" />
        <el-table-column prop="size" label="文件大小" />
        <el-table-column prop="updateTime" label="创建日期" width="150" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudCos from '@/api/tools/cos'
import { downloadFile2 } from '@/utils/index'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import eForm from './form'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  components: { eForm, pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '腾讯云存储', url: 'api/cos/files', crudMethod: { ...crudCos }})
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      permission: {
        del: ['tool:file:cos:del']
      },
      title: '文件', dialog: false,
      url: '', headers: { 'Authorization': getToken() },
      dialogImageUrl: '', dialogVisible: false, fileList: [], files: []
    }
  },
  computed: {
    ...mapGetters([
      'cosUploadApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
  },
  methods: {
    // 腾讯云配置
    doConfig() {
      const _this = this.$refs.form
      _this.init()
      _this.dialog = true
    },
    handleSuccess(response, file, fileList) {
      console.info(response)
      const uid = file.uid
      const id = response.data.id
      this.files.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid === file.uid) {
          crudCos.del([this.files[i].id]).then(res => {})
          return true
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 刷新列表数据
    doSubmit() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialog = false
      this.crud.toQuery()
    },
    // 监听上传异常
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.crud.notify(msg.message, CRUD.NOTIFICATION_TYPE.ERROR)
    },
    // 下载文件
    download(id, name) {
      this.downloadLoading = true
      crudCos.download(id).then(res => {
        this.downloadLoading = false
        downloadFile2(res, name)
      }).catch(err => {
        this.downloadLoading = false
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>
 ::v-deep .el-image__error, .el-image__placeholder{
    background: none;
  }
 ::v-deep .el-image-viewer__wrapper{
    top: 55px;
  }
</style>
