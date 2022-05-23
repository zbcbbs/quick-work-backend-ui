<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" title="腾讯云配置" append-to-body width="580px">
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="110px">
      <el-form-item label="Secret Id" prop="secretId">
        <el-input v-model="form.secretId" style="width: 95%" placeholder="秘钥管理中查看" />
      </el-form-item>
      <el-form-item label="Secret Key" prop="secretKey">
        <el-input v-model="form.secretKey" type="password" style="width: 95%;" placeholder="秘钥管理中查看" />
      </el-form-item>
      <el-form-item label="存储桶" prop="bucket">
        <el-input v-model="form.bucket" style="width: 95%;" placeholder="存储桶名称" />
      </el-form-item>
      <el-form-item label="访问域名" prop="domain">
        <el-input v-model="form.domain" style="width: 95%;" placeholder="访问域名" />
      </el-form-item>
      <el-form-item label="存储区域">
        <el-select v-model="form.region" placeholder="请选择存储区域">
          <el-option
            v-for="item in zones"
            :key="item.zone"
            :label="item.label"
            :value="item.zone"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="APPID" prop="appId">
        <el-input v-model="form.appId" style="width: 95%;" placeholder="APP ID" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="dialog = false">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { get, update } from '@/api/tools/cos'
export default {
  data() {
    return {
      zones: [{ label: '上海', zone: 'ap-shanghai' }],
      dialog: false,
      loading: false,
      form: { secretId: '', secretKey: '', bucket: '', domain: '', region: '', appId: '' },
      rules: {
        secretId: [
          { required: true, message: '请输入secretId', trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: '请输入secretKey', trigger: 'blur' }
        ],
        bucket: [
          { required: true, message: '请输入存储桶名称', trigger: 'blur' }
        ],
        domain: [
          { required: true, message: '请输入访问域名', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '请输入应用ID', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
      get().then(res => {
        this.form = res.data
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          update(this.form).then(res => {
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            this.$parent.crud.toQuery()
            this.loading = false
            this.dialog = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
