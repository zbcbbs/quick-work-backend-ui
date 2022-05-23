<template>
  <div>
    <div v-if="query.code === ''">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.itemValue" clearable size="small" placeholder="输入字典标签查询" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <rrOperation />
        </div>
      </div>
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="字典标签" prop="itemValue">
            <el-input v-model="form.itemValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字典值" prop="itemCode">
            <el-input v-model="form.itemCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="form.remark" type="textarea" maxlength="30" show-word-limit style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column label="所属字典">
          {{ query.code }}
        </el-table-column>
        <el-table-column prop="itemValue" label="字典标签" />
        <el-table-column prop="itemCode" label="字典值" />
        <el-table-column prop="remark" label="描述" :show-overflow-tooltip="true" />
        <el-table-column v-if="checkPer(['sys:dict:item:edit','sys:dict:item:del'])" label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudDictDetail from '@/api/system/dictDetail'
import CRUD, { presenter, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import rrOperation from '@crud/RR.operation'
import udOperation from '@crud/UD.operation'

const defaultForm = { id: null, itemCode: null, itemValue: null, remark: null }

export default {
  components: { pagination, rrOperation, udOperation },
  cruds() {
    return [
      CRUD({ title: '字典详情', url: 'api/dicts/items', query: { code: '' }, sort: ['id,desc'],
        crudMethod: { ...crudDictDetail },
        optShow: {
          add: true,
          edit: true,
          del: true,
          reset: false
        },
        queryOnPresenterCreated: false
      })
    ]
  },
  mixins: [
    presenter(),
    header(),
    form(function() {
      return Object.assign({ code: this.query.code }, defaultForm)
    })],
  data() {
    return {
      dictId: null, // 当前关联字典的ID
      rules: {
        itemCode: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        itemValue: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ]
      },
      permission: {
        add: ['sys:dict:item:add'],
        edit: ['sys:dict:item:edit'],
        del: ['sys:dict:item:del']
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
