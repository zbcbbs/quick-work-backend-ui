<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.rolename" size="small" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.time" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!-- 表单渲染 -->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="520px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 380px;" />
        </el-form-item>
        <el-form-item label="角色编码" prop="role">
          <el-input v-model="form.role" style="width: 380px;" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width: 140px" placeholder="请选择角色类型" @change="changeType">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="form.description" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table ref="table" v-loading="crud.loading" highlight-current-row style="width: 100%;" :data="crud.data" @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange">
            <el-table-column :selectable="checkboxT" type="selection" width="55" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="role" label="编码" />
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type === '1'">管理员角色</span>
                <span v-else>会员角色</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
            <el-table-column :show-overflow-tooltip="true" width="135px" prop="createTime" label="创建日期" />
            <el-table-column v-if="checkPer(['ROLE_ADMIN','sys:role:edit','sys:role:del'])" label="操作" width="130px" align="center" fixed="right">
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
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['ROLE_ADMIN','sys:role:edit']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            lazy
            :data="menus"
            :default-checked-keys="menuIds"
            :load="getMenuDatas"
            :props="defaultProps"
            accordion
            show-checkbox
            check-strictly
            node-key="id"
            @check="menuChange"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudRoles from '@/api/system/role'
import { getMenusTree, getChild, getParent, getCheckedNodes } from '@/api/system/menu'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, name: null, role: null, description: null, type: null }
export default {
  name: 'Role',
  components: { Treeselect, pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '角色', url: 'api/roles', crudMethod: { ...crudRoles }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      defaultProps: { children: 'children', label: 'title', isLeaf: 'leaf' },
      currentId: 0, menuLoading: false,
      menus: [], menuIds: [],
      permission: {
        add: ['sys:role:add'],
        edit: ['sys:role:edit'],
        del: ['sys:role:del']
      },
      types: [
        { id: '1', name: '管理员角色' },
        { id: '2', name: '会员角色' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showButton() {
      return this.menuIds.length > 0
    }
  },
  created() {

  },
  methods: {
    getMenuDatas(node, resolve) {
      setTimeout(() => {
        // 初始化时 PID=0 默认查询根节点
        getMenusTree(node.data.id ? node.data.id : 0).then(res => {
          resolve(res.data)
        })
      }, 100)
    },
    [CRUD.HOOK.afterRefresh]() {
      this.$refs.menu.setCheckedKeys([])
    },
    // 新增前
    [CRUD.HOOK.beforeToAdd](crud, form) {

    },
    // 编辑前初始化
    [CRUD.HOOK.beforeToEdit](crud, form) {
      return true
    },
    // 提交前操作
    [CRUD.HOOK.afterValidateCU](crud) {
      return true
    },
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空选中菜单
        this.$refs.menu.setCheckedKeys([])
        // 当前角色ID
        this.currentId = val.id
        // 初始化默认勾选
        this.menuIds = []
        val.permissions.forEach(function(data) {
          _this.menuIds.push(data)
        })
      }
    },
    menuChange(menu) {
      // 获取选中节点的所有关联节点 包含自身
      getCheckedNodes(menu.id).then(res => {
        const childIds = res.data
        // 判断是否在 menuIds 中，若存在则删除，否则添加
        if (this.menuIds.indexOf(menu.id) !== -1) {
          for (let i = 0; i < childIds.length; i++) {
            const index = this.menuIds.indexOf(childIds[i])
            if (index !== -1) {
              this.menuIds.splice(index, 1) // 删除
            }
          }
        } else {
          for (let i = 0; i < childIds.length; i++) {
            const index = this.menuIds.indexOf(childIds[i])
            if (index === -1) {
              this.menuIds.push(childIds[i]) // 添加
            }
          }
        }
        // console.info(this.menuIds)
        this.$refs.menu.setCheckedKeys(this.menuIds) // 设置选中的节点
      })
    },
    // 保存菜单
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, permissions: [] }
      // 得到已选中的 key 值
      this.menuIds.forEach(function(id) {
        role.permissions.push(id)
      })
      crudRoles.editMenu(role).then(() => {
        this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    },
    // 刷新表格对应的角色行
    update() {
      // 静默更新表格数据
      crudRoles.get(this.currentId).then(res => {
        const currentRole = res.data
        for (let i = 0; i < this.crud.data.length; i++) {
          if (currentRole.id === this.crud.data[i].id) {
            this.crud.data[i] = currentRole
            break
          }
        }
      })
    },
    changeType() { // 选择类型

    },
    checkboxT(row) {
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
 ::v-deep .vue-treeselect__multi-value{
    margin-bottom: 0;
  }
 ::v-deep .vue-treeselect__multi-value-item{
    border: 0;
    padding: 0;
  }
</style>
