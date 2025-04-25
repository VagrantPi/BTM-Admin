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
        <el-form ref="form1" :inline="true" :rules="rules1" :model="form1" label-position="left" style="margin:30px;">
          <el-form-item label="目前角色權限" prop="role">
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
          <el-form-item label="角色變更原因" prop="reason" style="margin-left: 50px;">
            <el-select v-model="form1.reason" placeholder="角色變更原因">
              <el-option
                v-for="item in reasons"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <br>
          <el-button v-if="type === 'black'" type="warning" @click="updateRole2Origin()">
            返回原始角色
          </el-button>
          <el-button type="warning" @click="updateRole()">
            更新
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br>
    <br>
    <br>
    <br>

    <el-tabs v-if="type !== 'black'" v-model="activeName2" type="border-card" class="demo-tabs">
      <el-tab-pane label="交易次數限制" name="limit">
        <el-form ref="form4" :inline="true" :rules="rules4" :model="form4" label-position="left" style="margin:30px;">
          <el-form-item label="天數" prop="velocity_days" :min="0">
            <el-input v-model.number="form4.velocity_days" :disabled="!isLimitEditable" />
          </el-form-item>
          <el-form-item label="次數" prop="velocity_times" :min="0">
            <el-input v-model.number="form4.velocity_times" :disabled="!isLimitEditable" />
          </el-form-item>
          <el-form-item label="限額變更原因" prop="reason" style="margin-left: 50px;">
            <el-select v-model="form4.reason" placeholder="限額變更原因">
              <el-option
                v-for="item in velocity_reasons"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <br>
          <el-button type="warning" :disabled="!isLimitEditable" @click="updateVelocity()">
            Update
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br>
    <br>
    <br>
    <br>

    <el-tabs v-if="type !== 'black'" v-model="activeName2" type="border-card" class="demo-tabs">
      <el-tab-pane label="限額" name="limit">
        <el-alert title="限額與 EDD 需要同時修改" type="info" show-icon />
        <el-form ref="form2" :inline="true" :rules="rules2" :model="form2" label-position="left" style="margin:30px;">
          <el-form-item label="日限額" prop="daily_limit" :min="0">
            <el-input v-model.number="form2.daily_limit" :disabled="!isLimitEditable" />
          </el-form-item>

          <el-form-item label="限額變更原因" prop="limit_reason" style="margin-left: 50px;">
            <el-select v-model="form2.limit_reason" placeholder="限額變更原因">
              <el-option
                v-for="item in limit_reasons"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="月限額" prop="monthly_limit" :min="0">
            <el-input v-model.number="form2.monthly_limit" :disabled="!isLimitEditable" />
          </el-form-item>
          <br>
          <br>
          <el-button type="" :disabled="!isLimitEditable" @click="nextTab()">
            下一個 tab
          </el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="EDD參數" name="edd">
        <el-alert title="限額與 EDD 需要同時修改" type="info" show-icon />
        <el-form ref="form3" :inline="true" :rules="rules3" :model="form3" label-position="left" style="margin:30px;">
          <el-form-item label="Level1 交易限額" prop="level1" :min="0">
            <el-input v-model.number="form3.level1" :disabled="!isLimitEditable" />
          </el-form-item>
          <el-form-item label="累積交易金額天數" prop="level1_days">
            <el-input v-model.number="form3.level1_days" :disabled="!isLimitEditable" />
          </el-form-item>
          <br>
          <el-form-item label="Level2 交易限額" prop="level2" :min="0">
            <el-input v-model.number="form3.level2" :disabled="!isLimitEditable" />
          </el-form-item>
          <el-form-item label="累積交易金額天數" prop="level2_days">
            <el-input v-model.number="form3.level2_days" :disabled="!isLimitEditable" />
          </el-form-item>
          <br>
          <el-button type="warning" :disabled="!isLimitEditable" @click="updateLimitSetting()">
            Update
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div v-if="type !== 'black'">
      <br>
      <br>
      <br>
      <br>
    </div>

    <el-tabs v-model="activeName3" type="border-card" class="demo-tabs">
      <el-tab-pane label="風險備註" name="log">
        <NoteTable
          v-if="customerId && phone"
          :customer-id="customerId"
          :phone="phone"
          :note-type="2"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import NoteTable from '@/components/Users/note/index.vue'

import { fetchRiskControlRoleList, fetchRiskControlRole, updateRiskControlRole, resetRiskControlRole, updateRiskControlLimit, updateRiskControlVelocity } from '@/api/riskControl'

export default {
  name: 'RiskControlView',
  components: { NoteTable },
  directives: { waves },
  props: {
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
      tableKey: 0,
      list: null,
      total: 0,
      type: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        table_name: 'btm_risk_control_customer_limit_settings',
        customer_id: '',
        date_range: ''
      },
      roles: [],
      rules1: {
        role: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      rules2: {
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
      rules3: {
        level1: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '限額必須為數字', trigger: 'blur' }
        ],
        level2: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '限額必須為數字', trigger: 'blur' }
        ],
        level1_days: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '天數必須為數字', trigger: 'blur' }
        ],
        level2_days: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '天數必須為數字', trigger: 'blur' }
        ]
      },
      rules4: {
        velocity_days: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '天數必須為數字', trigger: 'blur' }
        ],
        velocity_times: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '次數必須為數字', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '不能為空' }
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
      origin_daily_limit: 0,
      origin_monthly_limit: 0,
      form3: {
        level1: 0,
        level2: 0,
        level1_days: 0,
        level2_days: 0
      },
      form4: {
        velocity_times: 0,
        velocity_days: 0,
        reason: ''
      },
      origin_level1: 0,
      origin_level2: 0,
      origin_level1_days: 0,
      origin_level2_days: 0,
      activeName1: 'role',
      activeName2: 'limit',
      activeName3: 'log',
      user_role: 0,
      reasons: [],
      limit_reasons: [
        { name: '客戶主動申請' },
        { name: '加強監控' },
        { name: '其他特殊狀況' }
      ],
      reason: '',
      velocity_reasons: [
        { name: '加強監控' },
        { name: '其他特殊狀況' }
      ]
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
    this.listQuery.customer_id = this.customerId
    this.getRoleList()
    this.fetchRole()
  },
  methods: {
    nextTab() {
      this.$refs.form2.validate(valid => {
        if (valid) {
          if (this.origin_daily_limit === this.form2.daily_limit && this.origin_monthly_limit === this.form2.monthly_limit) {
            this.$message({
              message: '沒有限額被調整',
              type: 'warning'
            })
          } else {
            this.activeName2 = 'edd'
          }
        }
      })
    },
    updateVelocity() {
      this.$refs.form4.validate(valid => {
        if (valid) {
          updateRiskControlVelocity(this.customerId, this.form4, this.$store.getters.token)
            .then(response => {
              this.$message({
                type: 'success',
                message: '更新成功'
              })
              setTimeout(() => {
                location.reload()
              }, 500)
            })
            .catch(err => {
              if (err && err.msg && err.msg.includes('customer is black, cannot update')) {
                this.$message({
                  type: 'error',
                  message: '用戶是黑名單，無法更新'
                })
              }
              if (err && err.msg && err.msg.includes('no velocity update')) {
                this.$message({
                  type: 'error',
                  message: '數量跟舊的一致'
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
              if (action === 'confirm') {
                updateRiskControlRole(this.customerId, this.form1, this.$store.getters.token)
                  .then(response => {
                    this.$message({
                      type: 'success',
                      message: '更新成功'
                    })

                    setTimeout(() => {
                      location.reload()
                    }, 500)
                  })
              }
            }
          })
        }
      })
    },
    updateRole2Origin() {
      this.$alert('確定要回復原始角色權限嗎?', '更新角色權限', {
        type: 'warning',
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'confirm') {
            resetRiskControlRole(this.customerId, this.$store.getters.token)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '更新成功'
                })

                setTimeout(() => {
                  location.reload()
                }, 500)
              })
          }
        }
      })
    },
    async updateLimitSetting() {
      if (this.origin_daily_limit === this.form2.daily_limit && this.origin_monthly_limit === this.form2.monthly_limit) {
        this.$message({
          message: '更新 EDD 時限額也需要修改',
          type: 'warning'
        })
        this.activeName2 = 'limit'
        return
      }

      if (this.origin_level1 === this.form3.level1 && this.origin_level2 === this.form3.level2 && this.origin_level1_days === this.form3.level1_days && this.origin_level2_days === this.form3.level2_days) {
        this.$message({
          message: '沒有 EDD 限額或天數被調整',
          type: 'warning'
        })
        return
      }

      let valid1 = false
      let valid2 = false
      try {
        valid1 = await this.$refs.form2.validate()
      } catch (e) {
        valid1 = false
      }
      if (!valid1) {
        this.activeName2 = 'limit'
        return
      }
      try {
        valid2 = await this.$refs.form3.validate()
      } catch (e) {
        valid2 = false
      }
      if (valid2) {
        this.$alert('確定要更新交易限額與 EDD 限額嗎?', '更新交易限額與 EDD 限額', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              updateRiskControlLimit(this.customerId, this.form2, this.form3, this.$store.getters.token)
                .then(() => {
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  })

                  setTimeout(() => {
                    location.reload()
                  }, 500)
                })
                .catch(err => {
                  if (err && err.msg && err.msg.includes('customer is black, cannot update edd')) {
                    this.$message({
                      type: 'error',
                      message: '用戶是黑名單，無法更新 EDD 限額'
                    })
                  }
                  if (err && err.msg && err.msg.includes('no edd limit or days update')) {
                    this.$message({
                      type: 'error',
                      message: 'EDD 限額數量跟舊的一致'
                    })
                  }

                  if (err && err.msg && err.msg.includes('customer is black, cannot update limit')) {
                    this.$message({
                      type: 'error',
                      message: '用戶是黑名單，無法更新交易限額'
                    })
                  }
                  if (err && err.msg && err.msg.includes('no limit update')) {
                    this.$message({
                      type: 'error',
                      message: '交易限額數量跟舊的一致'
                    })
                  }
                })
            }
          }
        })
      }
    },
    fetchRole() {
      fetchRiskControlRole(this.customerId, this.$store.getters.token).then(response => {
        this.form1.role = response.data.role_id
        this.user_role = response.data.role_id
        this.form2.daily_limit = parseInt(response.data.daily_limit)
        this.origin_daily_limit = parseInt(response.data.daily_limit)
        this.form2.monthly_limit = parseInt(response.data.monthly_limit)
        this.origin_monthly_limit = parseInt(response.data.monthly_limit)
        this.form3.level1 = parseInt(response.data.level1)
        this.origin_level1 = parseInt(response.data.level1)
        this.form3.level2 = parseInt(response.data.level2)
        this.origin_level2 = parseInt(response.data.level2)
        this.form3.level1_days = parseInt(response.data.level1_days)
        this.origin_level1_days = parseInt(response.data.level1_days)
        this.form3.level2_days = parseInt(response.data.level2_days)
        this.origin_level2_days = parseInt(response.data.level2_days)
        this.type = this.roleId2String(response.data.role_id)
        this.form4.velocity_days = parseInt(response.data.velocity_days)
        this.form4.velocity_times = parseInt(response.data.velocity_times)

        switch (this.type) {
          case 'white':
            this.reasons = [
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
            ]
            break
          case 'gray':
            this.reasons = [
              { name: '非高風險職業' },
              { name: '經評估可設為白名單' },
              { name: 'STR' },
              { name: '告誡名單' },
              { name: '曾為告誡名單' },
              { name: '經評估須設為黑名單' },
              { name: '客戶申請關閉帳戶' }
            ]
            break
          case 'black':
            this.reasons = [
              { name: '移除告誡名單' },
              { name: '經評估可設為白名單' },
              { name: '經評估可設為灰名單' }
            ]
            break
        }
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
    },
    roleId2String(role_id) {
      switch (role_id) {
        case 1:
          return 'white'
        case 2:
          return 'gray'
        case 3:
          return 'black'
        default:
          return '未知權限'
      }
    }
  }
}
</script>
