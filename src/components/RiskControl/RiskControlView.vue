<style>
.filter-item {
  margin-left: 5px;
}
.highlight-option {
  background: #ffba0073;
}
</style>

<template>
  <div class="app-container">
    <h1>{{ title }} {{ phone }}</h1>

    <el-tabs v-model="activeName1" type="border-card" class="demo-tabs">
      <el-tab-pane label="角色變更" name="role">
        <el-form ref="form1" :inline="true" :model="form1" label-position="left" style="margin:30px;">
          <el-form-item
            :rules="[
              {
                required: true,
                message: '必填',
                trigger: 'blur',
              },
            ]"
            label="目前角色權限"
            prop="role"
          >
            <el-select v-model="form1.role" placeholder="目前角色權限">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :class="{'highlight-option': item.id !== user_role}"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[
              {
                required: true,
                message: '必填',
                trigger: 'blur',
              },
            ]"
            label="角色變更原因"
            prop="reason"
          >
            <el-select v-model="form1.reason" placeholder="角色變更原因">
              <el-option
                v-for="item in reasons"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-button id="update-role-button" type="warning" @click="updateRole()">
            Update
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br>
    <br>
    <br>
    <br>

    <el-tabs v-model="activeName2" type="border-card" class="demo-tabs">
      <el-tab-pane label="限額" name="limit">
        <el-form ref="form2" :rules="rules" :model="form2" label-position="left" label-width="150px" style="margin:30px;">
          <el-form-item label="日限額" prop="daily_limit" :min="0">
            <el-input v-model.number="form2.daily_limit" :disabled="!isLimitEditable" />
          </el-form-item>
          <el-form-item label="月限額" prop="monthly_limit" :min="0">
            <el-input v-model.number="form2.monthly_limit" :disabled="!isLimitEditable" />
          </el-form-item>
          <el-form-item label="限額變更原因" prop="limit_reason">
            <el-select v-model="form2.limit_reason" placeholder="限額變更原因">
              <el-option
                v-for="item in limit_reasons"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="warning" :disabled="!isLimitEditable" @click="updateLimit()">
          Update
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="EDD參數" name="log">
        <br>
        <br>
        <br>
        <br>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { fetchRiskControlRoleList, fetchRiskControlRole, updateRiskControlRole, updateRiskControlLimit } from '@/api/riskControl'

export default {
  name: 'RiskControlView',
  // components: { Pagination },
  directives: { waves },
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['white', 'gray', 'black'].includes(value)
    },
    phone: {
      type: String,
      required: true
    },
    customerId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      customer_id: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        table_name: 'btm_risk_control_customer_limit_settings',
        customer_id: '',
        date_range: ''
      },
      roles: [],
      rules: {
        daily_limit: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '限額必須為數字', trigger: 'blur' }
        ],
        monthly_limit: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '限額必須為數字', trigger: 'blur' }
        ],
        limit_reason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      form1: {
        role: 0,
        reason: ''
      },
      form2: {
        daily_limit: 0,
        monthly_limit: 0,
        limit_reason: ''
      },
      activeName1: 'role',
      activeName2: 'limit',
      user_role: 0,
      reasons: [
        { name: '高風險職業' },
        { name: '關懷客戶' },
        { name: '大額兌換客戶' },
        { name: '曾綁定非本人地址' },
        { name: '曾為告誡名單' },
        { name: '經評估須設為灰名單' },
        { name: 'STR' },
        { name: '告誡名單' },
        { name: '經評估須設為黑名單' },
        { name: '客戶申請關閉帳戶' }
      ],
      limit_reasons: [
        { name: '客戶主動申請' },
        { name: '加強監控' },
        { name: '其他特殊狀況' }
      ],
      reason: ''
    }
  },
  computed: {
    title() {
      const titles = {
        white: '風控白名單',
        gray: '風控灰名單',
        black: '風控黑名單'
      }
      return titles[this.type]
    },
    isLimitEditable() {
      return this.type !== 'black'
    }
  },
  created() {
    this.customer_id = this.customerId
    this.listQuery.customer_id = this.customerId
    this.getRoleList()
    this.fetchRole()
  },
  methods: {
    updateLimit() {
      this.$refs.form2.validate(valid => {
        if (valid) {
          this.$alert('確定要更新角色限額嗎?', '更新角色限額', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: action => {
              updateRiskControlLimit(this.customer_id, this.form2, this.$store.getters.token)
                .then(response => {
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  })
                  this.getRoleList()
                  this.fetchRole()
                })
                .catch(err => {
                  if (err && err.msg && err.msg.includes('customer is black')) {
                    this.$message({
                      type: 'error',
                      message: '用戶已是黑名單，無法更新限額'
                    })
                  }
                  if (err && err.msg && err.msg.includes('no limit update')) {
                    this.$message({
                      type: 'error',
                      message: '限額數量跟舊的一致'
                    })
                  }
                })
            }
          })
        }
      })
    },
    updateRole() {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          if (this.form1.role === this.user_role) {
            this.$message({
              message: '未更動角色權限',
              type: 'warning'
            })
            return
          }
          this.$alert('確定要更新角色權限嗎?', '更新角色權限', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: action => {
              updateRiskControlRole(this.customer_id, this.form1, this.$store.getters.token)
                .then(response => {
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  })
                  switch (this.type) {
                    case 'black':
                      switch (this.form1.role) {
                        case 2:
                          this.$router.push({ path: '/risk_control/graylist/view', query: { customerID: this.customer_id, phone: this.phone }})
                          break
                        case 1:
                          this.$router.push({ path: '/risk_control/whitelist/view', query: { customerID: this.customer_id, phone: this.phone }})
                          break
                      }
                      break
                    case 'gray':
                      switch (this.form1.role) {
                        case 1:
                          this.$router.push({ path: '/risk_control/whitelist/view', query: { customerID: this.customer_id, phone: this.phone }})
                          break
                        case 3:
                          this.$router.push({ path: '/risk_control/blacklist/view', query: { customerID: this.customer_id, phone: this.phone }})
                          break
                      }
                      break
                    case 'white':
                      switch (this.form1.role) {
                        case 2:
                          this.$router.push({ path: '/risk_control/graylist/view', query: { customerID: this.customer_id, phone: this.phone }})
                          break
                        case 3:
                          this.$router.push({ path: '/risk_control/blacklist/view', query: { customerID: this.customer_id, phone: this.phone }})
                          break
                      }
                      break
                  }
                })
            }
          })
        }
      })
    },
    fetchRole() {
      fetchRiskControlRole(this.customer_id, this.$store.getters.token).then(response => {
        this.form1.role = response.data.role_id
        this.user_role = response.data.role_id
        this.form2.daily_limit = parseInt(response.data.daily_limit)
        this.form2.monthly_limit = parseInt(response.data.monthly_limit)
      })
    },
    getRoleList() {
      this.listLoading = true
      fetchRiskControlRoleList(this.$store.getters.token).then(response => {
        this.roles = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    utc8Time(t) {
      if (t === '0001-01-01T00:00:00Z') {
        return ''
      }
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    },
    role2String(role) {
      switch (role) {
        case 0:
          return '未設定'
        case 1:
          return '白名單'
        case 2:
          return '灰名單'
        case 3:
          return '黑名單'
        default:
          return '未知權限'
      }
    },
    operationType2String(operation_type) {
      switch (operation_type) {
        case 1:
          // '新增'
          return '初始化'
        case 2:
          return '修改'
        case 3:
          return '刪除'
        default:
          return '未知操作'
      }
    }
  }
}
</script>
