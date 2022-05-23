<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.jobName" clearable size="small" placeholder="输入任务名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <date-range-picker v-model="query.time" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission">
        <!-- 任务日志 -->
        <el-button
          v-permission="['sys:job:log']"
          slot="right"
          class="filter-item"
          size="mini"
          type="info"
          icon="el-icon-tickets"
          @click="doLog"
        >日志</el-button>
      </crudOperation>
      <Log ref="log" />
    </div>
    <!--Form表单-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" append-to-body width="730px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="form.jobName" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="form.description" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Bean名称" prop="springBeanName">
          <el-select v-model="form.springBeanName" placeholder="请选择Bean" style="width: 220px;" @change="changeBean">
              <el-option
                v-for="item in beanNames"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="执行方法" prop="methodName">
          <el-select v-model="form.methodName" placeholder="请选择方法" style="width: 220px;">
              <el-option
                v-for="item in methodNames"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cron">
          <el-input v-model="form.cron" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="子任务ID">
          <el-input v-model="form.subTask" placeholder="多个用逗号隔开，按顺序执行" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="任务负责人" prop="personInCharge">
          <el-input v-model="form.personInCharge" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="告警邮箱" prop="email">
          <el-input v-model="form.email" placeholder="多个邮箱用逗号隔开" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="失败后暂停">
          <el-radio-group v-model="form.pauseAfterFailure" style="width: 220px">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="系统任务">
          <el-radio-group v-model="form.isSysJob" style="width: 220px">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio-group v-model="form.status" style="width: 220px">
            <el-radio :label="true">运行</el-radio>
            <el-radio :label="false">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数内容">
          <el-input v-model="form.params" style="width: 556px;" rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="任务ID" />
      <el-table-column :show-overflow-tooltip="true" prop="jobName" label="任务名称" />
      <el-table-column :show-overflow-tooltip="true" prop="springBeanName" label="Bean名称" />
      <el-table-column :show-overflow-tooltip="true" prop="methodName" label="执行方法" />
      <el-table-column :show-overflow-tooltip="true" prop="params" label="参数" />
      <el-table-column :show-overflow-tooltip="true" prop="cron" label="cron表达式" />
      <el-table-column :show-overflow-tooltip="true" prop="isSysJob" label="系统任务">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSysJob ? 'danger' : 'success'">{{ scope.row.isSysJob ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="status" width="90px" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'warning'">{{ scope.row.status ? '运行中' : '已暂停' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="description" width="150px" label="描述" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" width="136px" label="创建日期" />
      <el-table-column v-if="checkPer(['sys:job:edit','sys:job:del'])" label="操作" width="170px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['sys:job:edit']" size="mini" style="margin-right: 3px;" type="text" @click="crud.toEdit(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:job:edit']" style="margin-left: -2px" type="text" size="mini" @click="execute(scope.row.id)">执行</el-button>
          <el-button v-permission="['sys:job:edit']" style="margin-left: 3px" type="text" size="mini" @click="updateStatus(scope.row.id,scope.row.status ? '暂停' : '恢复')">
            {{ scope.row.status ? '暂停' : '恢复' }}
          </el-button>
          <el-popover
            :ref="scope.row.id"
            v-permission="['sys:job:del']"
            placement="top"
            width="200"
          >
            <p>确定停止并删除该任务吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudJob from '@/api/system/timing'
import Log from './log'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, jobName: null, subTask: null, SpringBeanName: null, methodName: null, params: null, cron: null, pauseAfterFailure: true, status: false, isSysJob: false, personInCharge: null,  email: null, description: null }
export default {
  name: 'Timing',
  components: { Log, pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '定时任务', url: 'api/jobs', crudMethod: { ...crudJob }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delLoading: false,
      beanNames: [], // spring bean 名称
      methodNames: [], // spring bean 方法名
      permission: {
        add: ['sys:job:add'],
        edit: ['sys:job:edit'],
        del: ['sys:job:del']
      },
      rules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ],
        springBeanName: [
          { required: true, message: '请输入Bean名称', trigger: 'change' }
        ],
        methodName: [
          { required: true, message: '请输入方法名称', trigger: 'change' }
        ],
        cron: [
          { required: true, message: '请输入Cron表达式', trigger: 'blur' }
        ],
        personInCharge: [
          { required: true, message: '请输入负责人名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 执行
    execute(id) {
      crudJob.execute(id).then(res => {
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 改变状态
    updateStatus(id, status) {
      if (status === '恢复') {
        this.updateParams(id)
      }
      crudJob.updateIsPause(id).then(res => {
        this.crud.toQuery()
        this.crud.notify(status + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    updateParams(id) {
      console.log(id)
    },
    delMethod(id) {
      this.delLoading = true
      crudJob.del(id).then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    // 显示日志
    doLog() {
      this.$refs.log.dialog = true
      this.$refs.log.doInit()
    },
    checkboxT(row, rowIndex) {
      return row.id > 0
    },
    changeBean(beanName){
      crudJob.getMethodNames(beanName).then(res => {
        this.methodNames = res.data
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 打开新增页面执行
    [CRUD.HOOK.beforeToAdd](){
      crudJob.getBeanNames().then(res => {
        this.beanNames = res.data
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>
